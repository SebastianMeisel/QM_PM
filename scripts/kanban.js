document.addEventListener('DOMContentLoaded', function () {
  const maxCards = { Todo: 6, Development: 4, Testing: 4 }
  let draggedElement = null
  let currentCount = { Todo: 0, Development: 0, Testing: 0 } // Initialize currentCount

  // Initialize 15 cards in Backlog
  for (let i = 1; i <= 15; i++) {
    addCard('Backlog', `Ticket ${i}`)
  }

  // Initialize currentCount
  ;['Todo', 'Development', 'Testing'].forEach((column) => {
    currentCount[column] = countCards(column, [`${column}-WIP`, `${column}-Done`])
  })

  // Function to refresh the displayed counts for each column
  function refreshCounts() {
    document.getElementById('WIP_Todo').innerText = `${currentCount['Todo']}/6`
    document.getElementById('WIP_Development').innerText = `${currentCount['Development']}/4`
    document.getElementById('WIP_Testing').innerText = `${currentCount['Testing']}/4`
  }

  function addCard(columnId, cardName) {
    const column = document.getElementById(columnId)
    const card = document.createElement('div')
    card.className = 'card'
    card.draggable = true
    card.innerHTML = cardName
    card.addEventListener('dragstart', dragStart)
    column.appendChild(card)
  }

  function dragStart(event) {
    event.dataTransfer.setData('text', event.target.innerHTML)
    event.dataTransfer.setData('sourceId', event.target.parentNode.id)
    draggedElement = event.target

    // Decrement the card count for the source column
    const sourceId = event.target.parentNode.id
    const mainColumnId = sourceId.split('-')[0]
    // if (!currentCount[mainColumnId]) {
    //   currentCount[mainColumnId] = 0
    // }
    currentCount[mainColumnId]--
  }

  const columns = document.getElementsByClassName('column')
  for (const column of columns) {
    column.addEventListener('dragover', dragOver)
    column.addEventListener('drop', drop)
  }

  function dragOver(event) {
    event.preventDefault()
  }

  function countCards(mainColumnId, subColumnIds) {
    let total = 0
    const mainColumn = document.getElementById(mainColumnId)
    if (mainColumn) {
      total += mainColumn.childElementCount
    }
    subColumnIds.forEach((id) => {
      const subColumn = document.getElementById(id)
      if (subColumn) {
        total += subColumn.childElementCount
      }
    })
    return total
  }

  function drop(event) {
    event.preventDefault()
    let columnId = event.target.id

    // If the target is a card, get the parent column ID
    if (event.target.className === 'card' || !columnId) {
      let parentElement = event.target
      while (parentElement && !parentElement.classList.contains('column')) {
        parentElement = parentElement.parentNode
      }
      columnId = parentElement ? parentElement.id : null
    }

    if (!columnId) return

    const mainColumnId = columnId.split('-')[0]
    const totalCards = currentCount[mainColumnId]

    if (columnId && (!maxCards[mainColumnId] || totalCards < maxCards[mainColumnId])) {
      addCard(columnId, draggedElement.innerHTML)
      currentCount[mainColumnId]++ // Increment the card count for the destination column

      // Remove the card from the original column if it's moved to a new column
      if (draggedElement) {
        const sourceMainColumnId = draggedElement.parentNode.id.split('-')[0]
        draggedElement.parentNode.removeChild(draggedElement)
        // if (sourceMainColumnId && currentCount[sourceMainColumnId] !== undefined) {
        //   currentCount[sourceMainColumnId]-- // Decrement the card count for the source column
        // }
      }
      // Refresh the displayed counts
      refreshCounts()
    }
  }
  refreshCounts()
})
