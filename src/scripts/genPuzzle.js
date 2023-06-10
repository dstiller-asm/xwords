function generatePuzzle(size) {
    function choice(arr) {
        return arr[Math.floor(Math.random() * (arr.length))];
    }

    function randInt(max) {
        return Math.floor(Math.random() * max);
    }

    function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    const words_used = [
        'bangles',
        'gang',
        'guarantee',
        'satellite',
        'minimum',
        'holy',
        'tram',
        'grip',
        'bible'
    ];

    function gen() {
        function largestGap(row) {
            let gaps = [];
            let gap = 0;
            for (let i = 0; i < row.length; i++) {
                if (row[i] != ' ') {
                    gaps.push(gap);
                    gap = 0;
                } else {
                    gap += 1;
                }
            }
            return Math.max(gaps);
        }

        function getCol(state, index) {
            var col = '';
            for (let i = 0; i < state.length; i++) {
                col += state[i][index];
            }
            return col;
        }

        let state = Array(size).fill(Array(size).fill(' ').join(''));
        let word_queue = shuffle(words_used);
        let dir = '', word = '';
        let i = 0;
        let first_row = -1, first_col = -1;
        while (word_queue.length > 0) {
            word = word_queue.pop();
            if (i == 0) {
                dir = choice(['across', 'down']);
            } else {
                if (dir === 'across') dir = 'down';
                else dir = 'across';
            }
            if (dir === 'across') {
                if (i == 0) {
                    first_row = randInt(size);
                    state[first_row] = word + Array(size - word.length).fill(' ').join('');
                } else {
                    let target_row = 0;
                    while (largestGap(state[target_row]) < word.length) {
                        if (target_row > state.length - 1) {
                            return gen();
                        }
                        target_row += 1;
                    }
                    let left = randInt(size - word.length);
                    state[target_row] = Array(left).fill(' ').join('') + word + Array(size - left - word.length).fill(' ').join('');
                }
            } else { // down
                if (i == 0) {
                    first_col = randInt(size);
                    for (let j = 0; j < word.length; j++) {
                        let right = size - 1 - first_col;
                        state[j] = Array(first_col).fill(' ').join('') + word[j] + Array(right).fill(' ').join('');
                    }
                } else {
                    let target_col = 0;
                    while (largestGap(getCol(state, target_col)) < word.length) {
                        if (target_col > state.length - 1) {
                            return gen();
                        }
                        target_col += 1;
                    }
                    for (let j = 0; j < word.length; j++) {
                    
                    }
                    
                }
            }
            i += 1;
        }

        return state;
    }

    let state = gen();

    let p = new Puzzle(size, size, 'xwords1', document.body);
    p.import(state);
    let hb = new HintBox(state, words_used, p);
}

generatePuzzle(10);