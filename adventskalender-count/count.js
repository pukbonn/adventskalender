const fs = require('fs')
const csv = require('csv')

/*
fs.readFile('./Website_Stats - Sheet3.csv', 'utf8', (error, data) => {
    if (error) {
        console.error(`Error reading file from disk: ${err}`);
    } else {
        const counts =
            data
            .split('\n')
            .map(line => line.substring(1, line.length - 2))
            .reduce((counts, line) => {
                counts.add(line)
                return counts
            }, new Set())
    }
})
*/

fs.readFile('./Website_Stats - Stats.csv', 'utf8', (error, data) => {
    if (error) {
        console.error(`Error reading file from disk: ${err}`);
    } else {
        csv.parse(data, function (err, data) {
            data = data
                .map(line => line[4] + '_' + line[7])


            // 131 = line[7]
            // 761 = line[2]
            // 144 = line[4]+'_'+line[7]
            // 764 = line[2]+'_'+line[4]+'_'+line[7]
            //  11 = line[4]


            const counts = data
                .reduce((counts, line) => {
                    counts.add(line)
                    return counts
                }, new Set())
        })
    }
})
