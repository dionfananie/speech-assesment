/**
 * List of HTML tags that we want to ignore when finding the top level readable elements
 * These elements should not be chosen while rendering the hover player
 */
const IGNORE_LIST = [
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "BUTTON",
  "LABEL",
  "SPAN",
  "IMG",
  "PRE",
  "SCRIPT",
];


const isTopLevelReadableElement = (element: HTMLElement) => {
  if (IGNORE_LIST.includes(element.tagName.toUpperCase())) {
    return false
  }

  if (!element.textContent?.trim()) {
    return false
  }

  //the element should not be a child of another element that has only one child.
  const parent = element.parentElement
  if (parent && parent.children.length === 1 && parent.children[0] === element) {
    return false
  }

  return true
}

/**
 *  **TBD:** Implement a function that returns all the top level readable elements on the page, keeping in mind the ignore list.
 *  A top level readable element is defined as follows:
 *    - The text node contained in the element should not be empty
 *    - The element should not be in the ignore list
 *    - The element should not be a child of another element that has only one child.
 *      For example: <div><blockquote>Some text here</blockquote></div>. div is the top level readable element and not blockquote
 */
export function getTopLevelReadableElementsOnPage(): HTMLElement[] {
  const topLevelElements: HTMLElement[] = []

  function collectTopLevelElement(elements: HTMLElement[]) {
    elements.forEach(element => {
      // check if an element isn't in the ignore list
      if (IGNORE_LIST.includes(element.tagName.toUpperCase())) {
        return
      }

      if (isTopLevelReadableElement(element)) {
        topLevelElements.push(element)
      }
  
      // recursivly collection top level element
      collectTopLevelElement(Array.from(element.children) as HTMLElement[])

    })
  }
  
  

  collectTopLevelElement(Array.from(document.body.children) as HTMLElement[])

  const filteredTopLevelElements = topLevelElements.filter(element => {
    // check no top level children
    const hasTopLevelReadableChildren = topLevelElements.some(child => {
      return child !== element && element.contains(child)
    })

    return !hasTopLevelReadableChildren
  })
  return filteredTopLevelElements

}
