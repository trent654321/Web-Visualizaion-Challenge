var sampleData;
d3.json('/data/samples.json').then(function(data) {
    sampleData=data
    var selDataset = document.getElementById('selDataset')
    for (var i in sampleData['samples']) {
        var sample = sampleData['samples'][i];
        var opt = document.createElement('option');
        opt.value = sample['id'];
        opt.innerHTML = sample['id'];
        selDataset.appendChild(opt);
    }
    console.log(data)
    console.log('data is loaded')
});
function optionChanged(data) {
    var sample = getSample(data);
    var meta = getMetadata(data);
    var metaHTML = getHTML(meta)
    document.getElementById('sample-metadata').innerHTML += metaHTML
    var arr = []
    for (var i in sample['otu_ids']) {
        arr.push([sample['otu_ids'][i],sample['otu_labels'][i],sample['sample_values'][i]])
    }
    
    arr.sort(compareFunction)
    var length = arr.length
    if (length>10){
        length = 10
    }
    topTen = arr.slice(0,length)
    drawBar(topTen,data)
    drawBubble(arr,data)

}
function getSample(id) {
    for (var i in sampleData['samples']) {
        sample = sampleData['samples'][i];
        if (sample['id']==id){
            return sample
        } 
    }
    console.log('sample ID not found');
    return 0;
}
function getMetadata(id) {
    for (var i in sampleData['metadata']) {
        metaData = sampleData['metadata'][i];
        if (metaData['id']==id){
            return metaData
        } 
    }
    console.log('sample ID not found');
    return 0;
}

function getHTML(data) {
    str = ''
    for (var key in data) {
        str= str + '<p>' + key +':' + data[key] + '</p>';
    }
    return str;
}

function compareFunction(a,b) {
    return (parseInt(b[3])-(parseInt(a[3])))
}

function drawBar(data,id) {
    var x = [];
    var y = [];
    var text = [];
    var title = 'Top ten OTU for sample ' + id;
    for (var i in data) {
        var innerArr = data[i]
        x.push(innerArr[0])
        y.push(innerArr[2])
        text.push(innerArr[1])
    };
    var barData = [
        {
            x: x,
            y: y,
            text: text,
            type: 'bar'
        }
    ];
    var barLayout = {title: title,
                    xaxis: {
                        type: 'category',
                        title: 'OTU ID'
                    },
                    yaxis: {
                        title: 'sample values'
                    }
    };
    Plotly.newPlot('bar',barData,barLayout)
}
function drawBubble(data,id){
    var x = []
    var y = []
    var markerSize = []
    var markerColour = []
    var text = []
    var title = 'OTU IDs and Sample Values for sample ' + id
    for (i in data) {
        var innerArr = data[i]
        x.push(innerArr[0])
        y.push(innerArr[2])
        markerSize.push(innerArr[2])
        markerColour.push(innerArr[0])
        text.push(innerArr[1])
    }
    var bubbleData = [
        {
            x: x,
            y: y,
            text: text,
            mode: 'markers',
            marker: {
                color: markerColour,
                size: markerSize
            }
        }
    ];
    var bubbleLayout = {
        title: title
    };
    Plotly.newPlot('bubble',bubbleData,bubbleLayout)
}