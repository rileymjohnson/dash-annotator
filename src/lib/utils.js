import * as R from 'ramda'

export const generateId = () => {
    return (
        Date.now().toString(36) +
        Math.floor(
            Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)
        ).toString(36)
    )
}

export const escapeRegex = R.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const regexSearch = (searchString, searchText) => {
    let searchRegex = escapeRegex(searchString)
    searchRegex = searchRegex.replace(/(?<s>\s)/gi, '$<s>?')
    searchRegex = new RegExp(searchRegex, 'gi')

    return searchText.matchAll(searchRegex)
}

export const debounce = (callback, wait) => {
    let timeout
    return (...args) => {
        // eslint-disable-next-line no-invalid-this
        const context = this
        clearTimeout(timeout)
        timeout = setTimeout(() => callback.apply(context, args), wait)
    }
}