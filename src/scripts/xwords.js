let state1 = [
    '   b      ',
    ' g a    b ',
    ' u n  grip',
    'gang h  b ',
    ' r l o  l ',
    'satellite ',
    ' n s y r  ',
    ' t     a  ',
    ' e minimum',
    ' e        '
]

function Letter(parent) {
    this.init(parent);
}

Letter.prototype = {
    init: function(parent) {
        this.input = document.createElement("input");
        this.input.className = 'xwords_letter';
        this.input.type = "text";
        this.input.size = 1;
        parent.appendChild(this.input);
        this.input.onblur = function(e) {
            e.target.value = e.target.value.toUpperCase();
        }
    },
    render: function() {

    }
};

function Puzzle(w, h, id, parent) {
    this.init(w, h, id, parent);
}

Puzzle.prototype = {
    init: function(w, h, id, parent) {
        this.w = w;
        this.h = h;
        this.container = document.createElement("div");
        this.container.className = "xwords_container";
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

function init() {
    const w = 10, h = 10;
    let p = new Puzzle(w, h, 'xwords1', document.body);
    p.import(state1);
}

init();