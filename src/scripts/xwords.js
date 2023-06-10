function Letter(parent) {
    this.init(parent);
}

Letter.prototype = {
    init: function(parent) {
        this.input = document.createElement('input');
        this.input.className = 'xwords_letter';
        this.input.type = "text";
        this.input.size = 1;

        parent.appendChild(this.input);
        
        this.input.onblur = function(e) {
            e.target.value = e.target.value.toUpperCase();
        }

        this.input.onfocus = function(e) {
            e.target.select();
        }
    },
    render: function() {

    }
};

function HintBox(state, words, puzzle) {
    this.init(state, words, puzzle);
}

HintBox.prototype = {
    init: function(state, words, puzzle) {
        this.state = state;
        this.words = words;
        this.puzzle = puzzle;
        this.render();
    },
    render: function() {
        this.container = document.createElement('div');
        this.container.className = 'xwords_hintbox';

        this.container.across = document.createElement('div');
        this.container.across.innerHTML = '<h2>across</h2>';
        this.container.appendChild(this.container.across);

        this.container.down = document.createElement('div');
        this.container.down.innerHTML = '<h2>down</h2>';
        this.container.appendChild(this.container.down);
        
        let word_map = [];
        let current_word = '';
        for (let i = 0; i < this.state.length; i++) {
            current_word = '';
            for (let j = 0; j < this.state[i].length; j++) {
                if (this.state[i][j] != ' ') { // valid letter
                    if ((j < this.state[i].length - 1) && (this.state[i][j + 1] != ' ')) { // going across
                        if (current_word == '') {
                            let end_of_word = this.state[i].indexOf(' ', j + 1);
                            if (end_of_word < 0) end_of_word = this.state[i].length;
                            current_word = this.state[i].substring(j, end_of_word);
                            word_map.push({
                                word: current_word,
                                row: i,
                                col: j,
                                dir: 'across'
                            });
                        }
                    }
                }
            }
        }
        for (let i = 0; i < this.state.length; i++) {
            current_word = '';
            for (let j = 0; j < this.state[i].length; j++) {
                if (this.state[i][j] != ' ') { // valid letter
                    if ((i < this.state.length - 1) && (this.state[i + 1][j] != ' ') && ((i == 0) || (this.state[i - 1][j] == ' '))) { // going down
                        if (current_word == '') {
                            for (let k = i; k < this.state.length; k++) {
                                if (this.state[k][j] == ' ') break;
                                current_word += this.state[k][j];
                            }
                            word_map.push({
                                word: current_word,
                                row: i,
                                col: j,
                                dir: 'down'
                            });
                            current_word = '';
                        }
                    }
                }
            }
        }

        word_map.sort(function(a, b) {
            if (a.col < b.col) {
                if (a.row < b.row) {
                    return -1;
                } else if (a.row > b.row) {
                    return 1;
                }
                return 0;
            }
            else if (a.col > b.col) {
                if (a.row < b.row) {
                    return -1;
                } else if (a.row > b.row) {
                    return 1;
                }
                return 0;
            } else if (a.col == b.col) {
                if (a.row < b.row) {
                    return -1;
                } else if (a.row > b.row) {
                    return 1;
                }
                return 0;
            }
        })
        
        for (let i = 0; i < word_map.length; i++) {
            if (word_map[i].dir == 'down') {
                this.container.down.innerHTML += `${i + 1}: ${getHint(word_map[i].word)}<br/>`;
            }
            else if (word_map[i].dir == 'across') {
                this.container.across.innerHTML += `${i + 1}: ${getHint(word_map[i].word)}<br/>`;
            }
            this.puzzle.rows[word_map[i].row][word_map[i].col].input.value = i + 1;
        }

        document.body.insertBefore(this.container, document.body.firstChild);
    }
};

function Puzzle(w, h, id, parent) {
    this.init(w, h, id, parent);
}

Puzzle.prototype = {
    init: function(w, h, id, parent) {
        this.w = w;
        this.h = h;
        this.container = document.createElement('div');
        this.container.className = 'xwords_container';
        this.container.id = id;
        parent.appendChild(this.container);

        this.rows = new Array(h).fill([]);
        for (let i = 0; i < this.rows.length; i++) this.rows[i] = new Array(w).fill(null);

        for (let i = 0; i < this.rows.length; i++) {
            for (let j = 0; j < this.rows[i].length; j++) {
                this.rows[i][j] = new Letter(this.container);
            }
        }

        this.render();
    },

    render: function() {
        this.container.style.width = String(this.w + 2) + 'em';
        this.container.style.height = String((this.h * 2) + 5) + 'ex';

        const that = this;

        let check_button = document.createElement('button');
        check_button.className = 'xwords_action_button';
        check_button.innerText = 'check';
        check_button.onclick = function() {
            alert(that.check());
        }
        this.container.parentNode.appendChild(check_button);

        let solve_button = document.createElement('button');
        check_button.className = 'xwords_action_button';
        solve_button.innerText = 'solve';
        solve_button.onclick = function() {
            that.solve();
        }
        this.container.parentNode.appendChild(solve_button);
    },

    import: function(state_array) {
        this.answers = state_array;
        for (let i = 0; i < state_array.length; i++) {
            for (let j = 0; j < state_array[i].length; j++) {
                this.rows[i][j].input.value = ' ';
                if (state_array[i][j] == ' ') this.rows[i][j].input.disabled = true;
            }
        }
    },

    check: function() {
        for (let i = 0; i < this.answers.length; i++) {
            for (let j = 0; j < this.answers[i].length; j++) {
                if (this.rows[i][j].input.value != this.answers[i][j].toUpperCase()) return false;
            }
        }
        return true;
    },

    solve: function() {
        for (let i = 0; i < this.answers.length; i++) {
            for (let j = 0; j < this.answers[i].length; j++) {
                this.rows[i][j].input.value = this.answers[i][j].toUpperCase();
            }
        }
    }
};