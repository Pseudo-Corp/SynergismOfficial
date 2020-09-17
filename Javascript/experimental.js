//These following features should be used with caution. Dev Drafts are usable in-game but are likely to break stuff. -Platonic

function sortResearchTableByCost(){
    let sampleArray = []
    let item = ""
    for(var i = 0; i <= 199; i++){
        sampleArray.push(researchOrderByCost[i]);
        item = document.getElementById('res'+(i+1))
        item.src = "Pictures/Transparent Pics/Research"+sampleArray[i]+".png"
        item.addEventListener('click', function(){buyResearch(researchOrderByCost[i])})
        item.addEventListener('mouseover', function(){researchDescriptions(researchOrderByCost[i])})
    }
}