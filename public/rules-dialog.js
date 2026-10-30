// Render the limited Markdown used by the project's rules, escaping all source
// text before inserting markup. The dialog always reads the same /rules source.
const escapeHtml = text => text.replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const inline = text => escapeHtml(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
function renderRules(markdown) {
 const blocks = markdown.trim().split(/\r?\n\s*\r?\n/);
 return blocks.map(block => {
  const lines=block.split(/\r?\n/);
  if (/^# /.test(block)) return ''; // The dialog already has its own title.
  const heading=block.match(/^(#{2,3}) (.+)$/);
  if (heading) {const level=heading[1].length+1;return `<h${level}>${inline(heading[2])}</h${level}>`;}
  if (lines.every(line=>line.startsWith('- '))) return `<ul>${lines.map(line=>`<li>${inline(line.slice(2))}</li>`).join('')}</ul>`;
  if (lines.length>=2 && /^\|[-:|\s]+\|$/.test(lines[1])) {
   const cells=line=>line.trim().replace(/^\||\|$/g,'').split('|').map(cell=>cell.trim());
   return `<div class="rules-table"><table><thead><tr>${cells(lines[0]).map(cell=>`<th scope="col">${inline(cell)}</th>`).join('')}</tr></thead><tbody>${lines.slice(2).map(line=>`<tr>${cells(line).map(cell=>`<td>${inline(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  return `<p>${inline(lines.join(' '))}</p>`;
 }).join('');
}
const trigger=document.querySelector('#open-rules');
const dialog=document.querySelector('#rules-dialog');
const content=document.querySelector('#rules-content');
const retry=document.querySelector('#retry-rules');
let loaded=false,loading=false;
async function loadRules(){
 if(loaded||loading)return;
 loading=true;retry.hidden=true;content.setAttribute('aria-busy','true');content.textContent='Loading rules…';
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),8000);
 try{
  const response=await fetch('/rules',{signal:controller.signal});
  if(!response.ok)throw Error('Rules unavailable');
  content.innerHTML=renderRules(await response.text());loaded=true;
 }catch{
  content.textContent='The rules couldn’t load. Check your connection and try again.';retry.hidden=false;
 }finally{clearTimeout(timeout);loading=false;content.removeAttribute('aria-busy');}
}
trigger.addEventListener('click',()=>{
 if(!dialog.open){dialog.showModal();document.body.classList.add('rules-open');}
 loadRules();
});
retry.addEventListener('click',loadRules);
document.querySelector('#close-rules').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{document.body.classList.remove('rules-open');trigger.focus();});
dialog.addEventListener('click',event=>{
 if(event.target!==dialog)return;
 const bounds=dialog.getBoundingClientRect();
 if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)dialog.close();
});
