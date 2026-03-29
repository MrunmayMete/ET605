export const DOMAIN = {
  chapter: {
    id: 'ch1',
    title: 'Grade 6 Patterns in Mathematics',
    subtopics: [
      {
        id: 'st1',
        title: 'Introduction to Patterns',
        concepts: [
          {
            id: 'c1',
            title: 'What is a Pattern?',
            content: 'A pattern is something that repeats or follows a rule. In math, patterns help us predict what comes next.',
            example: '2, 4, 6, 8 ... adds 2 each time.',
            storyExample: 'A shop arranges pens in rows of 3, 6, 9, 12. Each row has 3 more pens than the previous row.',
            remedial: 'Look for what changes between terms. Ask: add, subtract, multiply, or repeat?',
            questions: [
              q('q1', 'MCQ', 'What comes next: 5, 10, 15, ?', ['18', '20', '25', '30'], '20', 'easy', 'KC1', ['Count by 5s.', 'Each term is 5 more.']),
              q('q2', 'fill_blank', 'Complete: 3, 6, 9, __, 15', [], '12', 'easy', 'KC2', ['The pattern adds 3.', 'After 9 comes 12.']),
              q('q3', 'explanation', 'Explain the rule for 7, 14, 21, 28.', [], 'add 7 each time', 'medium', 'KC3', ['Find the difference between terms.', '14-7=7 and 21-14=7.'])
            ]
          }
        ]
      },
      {
        id: 'st2',
        title: 'Patterns in Numbers',
        concepts: [{
          id: 'c2',
          title: 'Arithmetic Sequences',
          content: 'In arithmetic sequences, the same number is added or subtracted each step.',
          example: '10, 13, 16, 19 has common difference 3.',
          storyExample: 'A staircase has 2 more tiles in each next row: 4, 6, 8, 10.',
          remedial: 'Subtract adjacent terms to find the common difference.',
          questions: [
            q('q4', 'MCQ', 'Find next: 9, 12, 15, 18, ?', ['19', '20', '21', '24'], '21', 'easy', 'KC2', ['Add the same value.', 'Difference is +3.']),
            q('q5', 'fill_blank', 'Common difference of 11, 15, 19, 23 is __', [], '4', 'medium', 'KC3', ['15-11 gives the step.', 'Every jump is 4.']),
            q('q6', 'explanation', 'Why is 4, 8, 12, 16 an arithmetic sequence?', [], 'same difference', 'hard', 'KC5', ['Check each gap.', 'All differences are 4.'])
          ]
        }]
      },
      {
        id: 'st3',
        title: 'Visualising Number Sequences',
        concepts: [{
          id: 'c3',
          title: 'Table and Graph View',
          content: 'Sequences can be shown in tables and simple point plots to see growth clearly.',
          example: 'Term:1,2,3 and Value:2,4,6.',
          storyExample: 'At a fair, ride tickets needed for rounds are 2,4,6 as rounds increase.',
          remedial: 'Make a table: term number vs value.',
          questions: [
            q('q7', 'visual', 'If term 1=3, term 2=6, term 3=9, term 4=?', [], '12', 'easy', 'KC4', ['Values increase by 3.', '9+3 gives next.']),
            q('q8', 'MCQ', 'Which value matches term 5 for 2n?', ['7', '8', '10', '12'], '10', 'medium', 'KC4', ['Replace n with 5.', '2×5=10.']),
            q('q9', 'explanation', 'Explain how a table helps identify a sequence rule.', [], 'shows term and value pattern', 'hard', 'KC5', ['Compare consecutive rows.', 'See consistent change each row.'])
          ]
        }]
      },
      {
        id: 'st4',
        title: 'Relations among Number Sequences',
        concepts: [{
          id: 'c4',
          title: 'Comparing Sequences',
          content: 'Two sequences can be related by differences, ratios, or shared rules.',
          example: 'A:2,4,6 and B:4,8,12. B is double A.',
          storyExample: 'One garden bed has 5,10,15 flowers; the second has twice as many.',
          remedial: 'Line up same term numbers and compare values.',
          questions: [
            q('q10', 'MCQ', 'If A term values are 3,6,9 and B are 6,12,18, relation is:', ['B=A+3', 'B=2A', 'B=A-3', 'B=A/2'], 'B=2A', 'medium', 'KC6', ['Compare same positions.', 'Each B is 2 times A.']),
            q('q11', 'fill_blank', 'If A_n=n and B_n=n+4, B_5 = __', [], '9', 'medium', 'KC6', ['Compute n+4 at n=5.', '5+4=9.']),
            q('q12', 'explanation', 'How do you know one sequence grows faster than another?', [], 'larger increase each step', 'hard', 'KC5', ['Compare differences.', 'Bigger step means faster growth.'])
          ]
        }]
      },
      {
        id: 'st5',
        title: 'Patterns in Shapes',
        concepts: [{
          id: 'c5',
          title: 'Growing Shape Patterns',
          content: 'Shape patterns grow by adding blocks in a repeatable way.',
          example: 'Figure 1 has 1 square, figure 2 has 3, figure 3 has 5.',
          storyExample: 'A child builds train cars with blocks: each new car adds 2 blocks.',
          remedial: 'Count blocks in each figure and list them as a sequence.',
          questions: [
            q('q13', 'visual', 'Squares in figures: 1,3,5,7, __', [], '9', 'easy', 'KC4', ['Pattern of odd numbers.', 'Add 2 each time.']),
            q('q14', 'MCQ', 'Figure numbers 1,2,3 have dots 4,7,10. Figure 4 dots?', ['11', '12', '13', '14'], '13', 'medium', 'KC2', ['Difference is +3.', '10+3=13.']),
            q('q15', 'explanation', 'Describe the rule for figures with 2,5,8,11 dots.', [], 'add 3 each figure', 'hard', 'KC3', ['Find constant change.', 'Each term increases by 3.'])
          ]
        }]
      },
      {
        id: 'st6',
        title: 'Relation between Shapes and Numbers',
        concepts: [{
          id: 'c6',
          title: 'From Figure Number to Formula',
          content: 'We can connect figure number n to blocks using a number rule.',
          example: 'If figure pattern is 3,6,9,... rule is 3n.',
          storyExample: 'Lantern rows use 4 bulbs each row; row n has 4n bulbs.',
          remedial: 'Check first few terms and match with n=1,2,3.',
          questions: [
            q('q16', 'MCQ', 'If blocks follow 5,10,15,... rule is:', ['n+5', '5n', 'n-5', '2n'], '5n', 'medium', 'KC3', ['See multiples of 5.', 'At n=3, 5n=15.']),
            q('q17', 'fill_blank', 'For rule 2n+1, value at n=4 is __', [], '9', 'medium', 'KC6', ['Substitute n=4.', '2*4+1=9.']),
            q('q18', 'explanation', 'How are figure number and blocks related in 4,8,12,16?', [], 'blocks equal 4 times figure number', 'hard', 'KC6', ['Find a formula using n.', 'Each value is 4×n.'])
          ]
        }]
      }
    ]
  }
};

function q(id, type, prompt, options, answer, difficulty, kc, hints) {
  return { id, type, prompt, options, answer, difficulty, kc, hints, explanation: `The correct response is ${answer}.`, remedial: 'Review the rule and try a similar easier question.' };
}
