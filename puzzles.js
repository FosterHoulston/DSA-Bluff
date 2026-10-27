export const puzzles = [
  {
    "title": "Find the target",
    "topic": "Binary search",
    "statement": "Find the index of a target in a sorted list of distinct integers, or return −1 if absent. The search must take logarithmic time.",
    "code": "lo, hi = {{1}}, {{2}}\nwhile lo <= hi:\n    mid = (lo + hi) // 2\n    if nums[mid] == target:\n        return mid\n    if nums[mid] < target:\n        lo = {{3}}\n    else:\n        hi = {{4}}\nreturn -1",
    "correct": "a",
    "options": [
      {
        "id": "a",
        "values": [
          "0",
          "len(nums) - 1",
          "mid + 1",
          "mid - 1"
        ],
        "why": "Correct: discard mid after checking it."
      },
      {
        "id": "b",
        "values": [
          "0",
          "len(nums) - 1",
          "mid",
          "mid - 1"
        ],
        "why": "For [1, 3], target 3, lo remains 0 forever."
      },
      {
        "id": "c",
        "values": [
          "0",
          "len(nums) - 1",
          "mid + 1",
          "mid"
        ],
        "why": "For [1], target 0, hi remains 0 forever."
      },
      {
        "id": "d",
        "values": [
          "0",
          "len(nums) - 1",
          "mid - 1",
          "mid + 1"
        ],
        "why": "For [1, 3], target 3, the lower bound moves backward."
      },
      {
        "id": "e",
        "values": [
          "0",
          "len(nums) - 1",
          "hi + 1",
          "lo - 1"
        ],
        "why": "For [1, 3, 5], target 5, advancing past hi skips the answer."
      }
    ],
    "explanation": "Sorted order lets each comparison discard half the candidates. Since mid was already checked, both updates must exclude it."
  },
  {
    "title": "First eligible position",
    "topic": "Binary search",
    "statement": "Return the first index whose value is at least target in a sorted list, or the list length if none qualifies. Each comparison should discard roughly half the remaining positions.",
    "code": "lo, hi = 0, len(nums)\nwhile {{1}}:\n    mid = (lo + hi) // 2\n    if nums[mid] < target:\n        lo = {{2}}\n    else:\n        hi = {{3}}\nreturn lo",
    "correct": "a",
    "options": [
      {
        "id": "a",
        "values": [
          "lo < hi",
          "mid + 1",
          "mid"
        ],
        "why": "Correct: keep a qualifying mid as a candidate."
      },
      {
        "id": "b",
        "values": [
          "lo <= hi",
          "mid + 1",
          "mid"
        ],
        "why": "For an empty list this enters the loop and indexes nums[0]."
      },
      {
        "id": "c",
        "values": [
          "lo < hi",
          "mid",
          "mid"
        ],
        "why": "For [1], target 2, lo never advances."
      },
      {
        "id": "d",
        "values": [
          "lo < hi",
          "mid + 1",
          "mid - 1"
        ],
        "why": "For [1, 3], target 2, it incorrectly returns index 0."
      },
      {
        "id": "e",
        "values": [
          "lo > hi",
          "mid + 1",
          "mid"
        ],
        "why": "For [1], target 2, the loop never starts and returns 0."
      }
    ],
    "explanation": "This is a lower-bound search over a half-open interval. A qualifying midpoint remains a possible first answer."
  },
  {
    "title": "A pair with a target sum",
    "topic": "Hash maps",
    "statement": "Return the indices of two different elements whose sum is target, or an empty list if no pair exists. Process the unsorted integers in one pass.",
    "code": "seen = {}\nfor i, x in enumerate(nums):\n    need = {{1}}\n    if need in seen:\n        return [seen[need], i]\n    seen[{{2}}] = {{3}}\nreturn []",
    "correct": "a",
    "options": [
      {
        "id": "a",
        "values": [
          "target - x",
          "x",
          "i"
        ],
        "why": "Correct: store earlier values and look up their complement."
      },
      {
        "id": "b",
        "values": [
          "target + x",
          "x",
          "i"
        ],
        "why": "For [2, 7], target 9, the needed 2 is never sought."
      },
      {
        "id": "c",
        "values": [
          "target - x",
          "i",
          "x"
        ],
        "why": "For [2, 7], target 9, values are stored under indices so the pair is missed."
      },
      {
        "id": "d",
        "values": [
          "x - target",
          "x",
          "i"
        ],
        "why": "For [2, 7], target 9, it looks for −2 rather than 2."
      },
      {
        "id": "e",
        "values": [
          "target",
          "x",
          "i"
        ],
        "why": "For [2, 7], target 9, it searches for 9 and misses the pair."
      }
    ],
    "explanation": "A hash map remembers earlier values, giving constant-time complement lookups on average. Lookup before insertion prevents reusing the same index."
  },
  {
    "title": "Any duplicate?",
    "topic": "Hash maps",
    "statement": "Determine whether an unsorted list of integers contains any repeated value. Use one pass with extra space allowed.",
    "code": "seen = set()\nfor x in nums:\n    if {{1}}:\n        return True\n    seen.add(x)\nreturn False",
    "correct": "a",
    "options": [
      {
        "id": "a",
        "values": [
          "x in seen"
        ],
        "why": "Correct: a prior occurrence proves a duplicate."
      },
      {
        "id": "b",
        "values": [
          "x not in seen"
        ],
        "why": "For [1], it reports a duplicate immediately."
      },
      {
        "id": "c",
        "values": [
          "len(seen) > 1"
        ],
        "why": "For [1, 2, 3], the third unique value causes True."
      },
      {
        "id": "d",
        "values": [
          "x == len(seen)"
        ],
        "why": "For [0], it reports a duplicate."
      },
      {
        "id": "e",
        "values": [
          "False"
        ],
        "why": "For [1, 1], it never detects the repeat."
      }
    ],
    "explanation": "Set membership tracks values already encountered without comparing every pair."
  },
  {
    "title": "Count target-sum subarrays",
    "topic": "Hash maps",
    "statement": "Count contiguous subarrays whose sum is k; integers may be negative. Find a solution that scans the list once.",
    "code": "freq = {0: 1}\ntotal = count = 0\nfor x in nums:\n    total += x\n    count += freq.get({{1}}, 0)\n    freq[total] = freq.get(total, 0) + 1\nreturn count",
    "correct": "a",
    "options": [
      {
        "id": "a",
        "values": [
          "total - k"
        ],
        "why": "Correct: subtract a previous prefix sum to obtain k."
      },
      {
        "id": "b",
        "values": [
          "total + k"
        ],
        "why": "For [1], k=1, it misses the qualifying subarray."
      },
      {
        "id": "c",
        "values": [
          "k - total"
        ],
        "why": "For [2, 1], k=1, it misses the final element."
      },
      {
        "id": "d",
        "values": [
          "total"
        ],
        "why": "For [1], k=1, it counts zero instead of one."
      },
      {
        "id": "e",
        "values": [
          "k"
        ],
        "why": "For [1], k=1, it misses the initial subarray."
      }
    ],
    "explanation": "A subarray sum is the difference of two prefix sums. Negative values make a simple shrinking sum window unsuitable."
  },
  {
    "title": "Balanced parentheses",
    "topic": "Stacks",
    "statement": "Determine whether a string containing only opening and closing parentheses is balanced. Every closing parenthesis must match an earlier unmatched opening parenthesis.",
    "code": "stack = []\nfor ch in text:\n    if ch == \"(\":\n        stack.append(ch)\n    else:\n        if {{1}}:\n            return False\n        {{2}}\nreturn {{3}}",
    "correct": "a",
    "options": [
      {
        "id": "a",
        "values": [
          "not stack",
          "stack.pop()",
          "not stack"
        ],
        "why": "Correct: reject an unmatched close and require no leftover opens."
      },
      {
        "id": "b",
        "values": [
          "stack",
          "stack.pop()",
          "not stack"
        ],
        "why": "For \"()\", it rejects a matching close."
      },
      {
        "id": "c",
        "values": [
          "not stack",
          "stack.clear()",
          "not stack"
        ],
        "why": "For \"(()\", clear removes two opens for one close and incorrectly accepts."
      },
      {
        "id": "d",
        "values": [
          "not stack",
          "stack.pop()",
          "bool(stack)"
        ],
        "why": "For \"(\", it incorrectly accepts leftover openings."
      },
      {
        "id": "e",
        "values": [
          "not stack",
          "stack.append(ch)",
          "not stack"
        ],
        "why": "For \"()\", the close is pushed instead of matched and the result is False."
      }
    ],
    "explanation": "A stack matches the most recent unmatched opening. Empty-stack checks prevent unmatched closings; the final check catches leftover openings."
  },
  {
    "title": "Next warmer day",
    "topic": "Stacks",
    "statement": "For each daily temperature, return how many days until a strictly warmer temperature, or zero if none follows. Avoid scanning all later days for every entry.",
    "code": "answer = [0] * len(temps)\nstack = []\nfor i, t in enumerate(temps):\n    while stack and {{1}}:\n        j = stack.pop()\n        answer[j] = {{2}}\n    stack.append(i)\nreturn answer",
    "correct": "a",
    "options": [
      {
        "id": "a",
        "values": [
          "t > temps[stack[-1]]",
          "i - j"
        ],
        "why": "Correct: resolve colder days with their index distance."
      },
      {
        "id": "b",
        "values": [
          "t >= temps[stack[-1]]",
          "i - j"
        ],
        "why": "For [70, 70], equal temperature is incorrectly treated as warmer."
      },
      {
        "id": "c",
        "values": [
          "t < temps[stack[-1]]",
          "i - j"
        ],
        "why": "For [70, 60], it incorrectly resolves the hotter day."
      },
      {
        "id": "d",
        "values": [
          "t > temps[stack[-1]]",
          "j - i"
        ],
        "why": "For [60, 70], the wait becomes −1."
      },
      {
        "id": "e",
        "values": [
          "t > temps[stack[-1]]",
          "i"
        ],
        "why": "For [80, 60, 70], index 1 gets 2 instead of a 1-day wait."
      }
    ],
    "explanation": "Maintain unresolved indices in decreasing temperature order. Every index is pushed and popped at most once, giving linear total work."
  },
  {
    "title": "Sorted pair search",
    "topic": "Two pointers",
    "statement": "Return whether two different elements in a sorted integer list sum to target. Use constant extra space and scan in linear time.",
    "code": "lo, hi = 0, len(nums) - 1\nwhile {{1}}:\n    s = nums[lo] + nums[hi]\n    if s == target:\n        return True\n    if s < target:\n        {{2}}\n    else:\n        {{3}}\nreturn False",
    "correct": "a",
    "options": [
      {
        "id": "a",
        "values": [
          "lo < hi",
          "lo += 1",
          "hi -= 1"
        ],
        "why": "Correct: increase a small sum and decrease a large sum."
      },
      {
        "id": "b",
        "values": [
          "lo <= hi",
          "lo += 1",
          "hi -= 1"
        ],
        "why": "For [2], target 4, it reuses one element twice."
      },
      {
        "id": "c",
        "values": [
          "lo < hi",
          "hi -= 1",
          "lo += 1"
        ],
        "why": "For [1, 2, 4], target 6, the small initial sum moves the wrong pointer."
      },
      {
        "id": "d",
        "values": [
          "lo > hi",
          "lo += 1",
          "hi -= 1"
        ],
        "why": "For [1, 2], target 3, the loop never starts."
      },
      {
        "id": "e",
        "values": [
          "lo < hi",
          "lo += 2",
          "hi -= 1"
        ],
        "why": "For [1, 2, 4], target 6, the pointer skips the needed 2."
      }
    ],
    "explanation": "Sorted order tells us which pointer can move toward the target. Distinct indices require lo < hi."
  },
  {
    "title": "Reverse in place",
    "topic": "Two pointers",
    "statement": "Reverse a list in place using constant extra space. Return the modified list.",
    "code": "lo, hi = 0, len(nums) - 1\nwhile lo < hi:\n    nums[lo], nums[hi] = nums[hi], nums[lo]\n    lo += {{1}}\n    hi -= {{2}}\nreturn nums",
    "correct": "a",
    "options": [
      {
        "id": "a",
        "values": [
          "1",
          "1"
        ],
        "why": "Correct: move both ends inward one position."
      },
      {
        "id": "b",
        "values": [
          "0",
          "1"
        ],
        "why": "For [1, 2, 3], the first element is swapped twice and the result is wrong."
      },
      {
        "id": "c",
        "values": [
          "1",
          "0"
        ],
        "why": "For [1, 2, 3], the last element is swapped twice."
      },
      {
        "id": "d",
        "values": [
          "2",
          "1"
        ],
        "why": "For [1, 2, 3, 4], the inner pair is skipped."
      },
      {
        "id": "e",
        "values": [
          "0",
          "0"
        ],
        "why": "For [1, 2], the loop never ends."
      }
    ],
    "explanation": "Swapping symmetric positions and moving both pointers inward visits each pair once."
  },
  {
    "title": "Fixed-size maximum sum",
    "topic": "Sliding window",
    "statement": "Find the largest sum of any contiguous block of exactly k integers, where 1 ≤ k ≤ the list length. Update each next block without summing all k elements again.",
    "code": "window = sum(nums[:k])\nbest = window\nfor i in range(k, len(nums)):\n    window += {{1}}\n    best = {{2}}\nreturn best",
    "correct": "a",
    "options": [
      {
        "id": "a",
        "values": [
          "nums[i] - nums[i - k]",
          "max(best, window)"
        ],
        "why": "Correct: add the incoming element and remove the outgoing one."
      },
      {
        "id": "b",
        "values": [
          "nums[i] + nums[i - k]",
          "max(best, window)"
        ],
        "why": "For [1, 2], k=1, it accumulates 4 instead of 2."
      },
      {
        "id": "c",
        "values": [
          "nums[i] - nums[i - k]",
          "min(best, window)"
        ],
        "why": "For [1, 2], k=1, it returns 1 rather than 2."
      },
      {
        "id": "d",
        "values": [
          "nums[i] - nums[i - 1]",
          "max(best, window)"
        ],
        "why": "For [1, 2, 3], k=2, it calculates 4 instead of 5."
      },
      {
        "id": "e",
        "values": [
          "nums[i - k] - nums[i]",
          "max(best, window)"
        ],
        "why": "For [1, 2], k=1, the sum changes in the wrong direction."
      }
    ],
    "explanation": "Consecutive fixed-size windows share all but two elements. Updating the sum makes the scan linear."
  },
  {
    "title": "Longest unique substring",
    "topic": "Sliding window",
    "statement": "Return the length of the longest contiguous substring with no repeated characters. Scan the string once, allowing extra memory for character positions.",
    "code": "last = {}\nleft = best = 0\nfor right, ch in enumerate(text):\n    if ch in last:\n        left = {{1}}\n    last[ch] = right\n    best = max(best, {{2}})\nreturn best",
    "correct": "a",
    "options": [
      {
        "id": "a",
        "values": [
          "max(left, last[ch] + 1)",
          "right - left + 1"
        ],
        "why": "Correct: keep the left edge from moving backward."
      },
      {
        "id": "b",
        "values": [
          "last[ch] + 1",
          "right - left + 1"
        ],
        "why": "For \"abba\", left moves backward at the final a and produces 3 instead of 2."
      },
      {
        "id": "c",
        "values": [
          "max(left, last[ch])",
          "right - left + 1"
        ],
        "why": "For \"aa\", the repeated a stays inside the window."
      },
      {
        "id": "d",
        "values": [
          "max(left, last[ch] + 1)",
          "right - left"
        ],
        "why": "For \"a\", it returns 0 instead of 1."
      },
      {
        "id": "e",
        "values": [
          "max(left, right)",
          "right - left + 1"
        ],
        "why": "For \"dvdf\", it discards v unnecessarily and returns 2 instead of 3."
      }
    ],
    "explanation": "The window contains only unique characters. Jump past the prior duplicate, while ensuring the left edge never retreats."
  },
  {
    "title": "Count ways to climb",
    "topic": "Dynamic programming",
    "statement": "You can climb one or two steps at a time. Return the number of distinct ways to reach step n, where n ≥ 1, using constant extra space.",
    "code": "a, b = 1, 1\nfor _ in range(2, n + 1):\n    a, b = {{1}}, {{2}}\nreturn b",
    "correct": "a",
    "options": [
      {
        "id": "a",
        "values": [
          "b",
          "a + b"
        ],
        "why": "Correct: ways(n) = ways(n−1) + ways(n−2)."
      },
      {
        "id": "b",
        "values": [
          "b",
          "a * b"
        ],
        "why": "For n=2, it returns 1 instead of 2."
      },
      {
        "id": "c",
        "values": [
          "a",
          "a + b"
        ],
        "why": "For n=4, it returns 4 instead of 5 because a never advances."
      },
      {
        "id": "d",
        "values": [
          "a + b",
          "b"
        ],
        "why": "For n=2, b remains 1."
      },
      {
        "id": "e",
        "values": [
          "b",
          "b + 1"
        ],
        "why": "For n=4, it returns 4 instead of 5."
      }
    ],
    "explanation": "The final move comes from one step below or two steps below. Store only the two previous counts; simultaneous assignment uses their old values."
  },
  {
    "title": "Best contiguous sum",
    "topic": "Dynamic programming",
    "statement": "Return the largest sum of a nonempty contiguous subarray from a nonempty integer list. Values may all be negative; solve in one pass.",
    "code": "current = best = nums[0]\nfor x in nums[1:]:\n    current = {{1}}\n    best = {{2}}\nreturn best",
    "correct": "a",
    "options": [
      {
        "id": "a",
        "values": [
          "max(x, current + x)",
          "max(best, current)"
        ],
        "why": "Correct: either start at x or extend the prior subarray."
      },
      {
        "id": "b",
        "values": [
          "max(0, current + x)",
          "max(best, current)"
        ],
        "why": "For [−2, −1], it incorrectly permits the empty sum 0."
      },
      {
        "id": "c",
        "values": [
          "current + x",
          "max(best, current)"
        ],
        "why": "For [−2, 3], it fails to restart at 3."
      },
      {
        "id": "d",
        "values": [
          "max(x, current + x)",
          "current"
        ],
        "why": "For [3, −2], it loses the earlier best sum 3."
      },
      {
        "id": "e",
        "values": [
          "max(x, current)",
          "max(best, current)"
        ],
        "why": "For [1, 2], it never combines adjacent positive values."
      }
    ],
    "explanation": "Track the best sum ending at the current position separately from the best sum seen anywhere."
  },
  {
    "title": "Maximum nonadjacent sum",
    "topic": "Dynamic programming",
    "statement": "Choose nonadjacent elements from a list of nonnegative integers to maximize their sum. Choosing no elements is allowed; use constant extra space.",
    "code": "prev2 = prev1 = 0\nfor x in nums:\n    prev2, prev1 = {{1}}, {{2}}\nreturn prev1",
    "correct": "a",
    "options": [
      {
        "id": "a",
        "values": [
          "prev1",
          "max(prev1, prev2 + x)"
        ],
        "why": "Correct: skip x or combine it with the best two positions back."
      },
      {
        "id": "b",
        "values": [
          "prev1",
          "prev1 + x"
        ],
        "why": "For [2, 3], it chooses adjacent elements and returns 5."
      },
      {
        "id": "c",
        "values": [
          "prev2",
          "max(prev1, prev2 + x)"
        ],
        "why": "For [2, 1, 2], prev2 never advances and it misses the sum 4."
      },
      {
        "id": "d",
        "values": [
          "prev1",
          "min(prev1, prev2 + x)"
        ],
        "why": "For [2], it returns 0 instead of 2."
      },
      {
        "id": "e",
        "values": [
          "prev1",
          "max(prev2, x)"
        ],
        "why": "For [2, 1, 2], it never combines the two nonadjacent 2s."
      }
    ],
    "explanation": "At each index, compare skipping the element against taking it plus the best result that excludes its neighbor."
  },
  {
    "title": "First occurrence",
    "topic": "Binary search",
    "statement": "Return the first index of target in a sorted list that may contain duplicates, or −1 if absent. Use logarithmic time.",
    "code": "lo, hi, answer = 0, len(nums) - 1, -1\nwhile lo <= hi:\n    mid = (lo + hi) // 2\n    if nums[mid] >= target:\n        if nums[mid] == target:\n            answer = mid\n        hi = {{1}}\n    else:\n        lo = {{2}}\nreturn answer",
    "correct": "a",
    "options": [
      {
        "id": "a",
        "values": [
          "mid - 1",
          "mid + 1"
        ],
        "why": "Correct: remember a match and keep looking left."
      },
      {
        "id": "b",
        "values": [
          "mid",
          "mid + 1"
        ],
        "why": "For [1], target 1, hi remains 0 and the loop never ends."
      },
      {
        "id": "c",
        "values": [
          "mid - 1",
          "mid"
        ],
        "why": "For [1, 2], target 2, lo remains 0."
      },
      {
        "id": "d",
        "values": [
          "lo - 1",
          "mid + 1"
        ],
        "why": "For [2, 2, 2], target 2, it returns index 1 and skips index 0."
      },
      {
        "id": "e",
        "values": [
          "mid + 1",
          "mid + 1"
        ],
        "why": "For [1], target 1, hi grows and the interval fails to shrink."
      }
    ],
    "explanation": "Finding a match is not enough when duplicates exist. Record it, then search strictly to its left for an earlier match."
  },
  {
    "title": "Longest run of ones",
    "topic": "Sliding window",
    "statement": "Return the length of the longest contiguous run of 1s in a list containing only 0s and 1s. Use one pass and constant extra space.",
    "code": "run = best = 0\nfor x in nums:\n    if x == 1:\n        run = {{1}}\n    else:\n        run = {{2}}\n    best = max(best, run)\nreturn best",
    "correct": "a",
    "options": [
      {
        "id": "a",
        "values": [
          "run + 1",
          "0"
        ],
        "why": "Correct: extend on 1, reset on 0."
      },
      {
        "id": "b",
        "values": [
          "run + 1",
          "run"
        ],
        "why": "For [1, 0, 1], it joins separated runs and returns 2."
      },
      {
        "id": "c",
        "values": [
          "1",
          "0"
        ],
        "why": "For [1, 1], it returns 1 instead of 2."
      },
      {
        "id": "d",
        "values": [
          "run + 1",
          "1"
        ],
        "why": "For [0], it invents a run of length 1."
      },
      {
        "id": "e",
        "values": [
          "run * 2",
          "0"
        ],
        "why": "For [1], the run remains 0."
      }
    ],
    "explanation": "A contiguous run must restart after every zero. Keep the current run and the best completed or current run separately."
  }
];
