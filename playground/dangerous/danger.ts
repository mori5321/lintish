export {}

const tippps = [
    'Click on any AST node with a \'+\' to expand it',
    'Hovering over a node highlights the \
  corresponding location in the source code',
    'Shift-click on an AST node to expand the whole subtree'
]
function printTippps() {
    tippps.forEach((tip, i) => console.log(`Tip ${i}:` + tip))
}

printTippps()

