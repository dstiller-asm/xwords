let all_words = [
    { word: 'bangles', hint: 'rigid bracelets or anklets'},
    { word: 'gang', hint: 'group of criminals'},
    { word: 'guarantee', hint: 'assure'},
    { word: 'satellite', hint: 'this orbits the earth'},
    { word: 'minimum', hint: 'the lowest value'},
    { word: 'holy', hint: 'scared'},
    { word: 'tram', hint: 'like a train, but not on a track'},
    { word: 'grip', hint: 'get a [this]'},
    { word: 'bible', hint: 'holy book'},
];

function getHint(w) {
    for (let i = 0; i < all_words.length; i++) {
        if (all_words[i].word === w) return all_words[i].hint;
    }
    return '';
}