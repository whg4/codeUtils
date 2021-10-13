console.time('calculate')
const newsMap = new Map()

const newsList = Array.from({ length: 100000 }, () => ({
    uid: '8be34939-bc25-4b9e-999d-2daf19fbea7b',
    title:
        'Adipisicing do eu magna ex non est eu labore nisi duis enim elit.',
    tags: ['reprehenderit', 'cupidatat', 'ad', 'ea', 'labore'],
}))

const indexNews = (item, tag, contination) => {
    if (!newsMap.has(tag)) {
        newsMap.set(tag, [item])
    } else {
        newsMap.get(tag).push(item)
    }
    if (++indexNews.skip % 500 == 0) {
        setTimeout(contination, 0)
    } else {
        contination()
    }
}
indexNews.skip = 0

const iterate = (list, processTask, contination) => {
    const handleOne = (i, j, _contination) => {
        if (i < list.length) {
            const item = list[i]
            if (j < item.tags.length) {
                processTask(item, item.tags[j], function handleNext() {
                    handleOne(i, j + 1, _contination)
                })
            } else {
                handleOne(i + 1, 0, _contination)
            }
        } else {
            _contination()
        }
    }
    handleOne(0, 0, contination)
}

iterate(newsList, indexNews, () => {
    console.log('done!')
    console.timeEnd('calculate')
})


