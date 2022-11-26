var DataLoaded = {};
var Rules, Layouts, Questions, Endpoints, BodyMap;
var AdressObject = {
    BodyMap:'https://api.myjson.com/bins/dakfy',
    Endpoints: 'https://api.myjson.com/bins/yq67y',
    Questions: 'https://api.myjson.com/bins/159xvi',
    Rules: 'https://api.myjson.com/bins/17dney'
}
function FetchAndIniateData(param) {
    //get data
    if (param == 'Bodymap' || param == null) {

        $.get(AdressObject.BodyMap, function (data, textStatus, jqXHR) 
        {
            BodyMap = TAFFY([]);
            BodyMap.insert(data);
            DataLoaded.BodyMap = true;
            if(DataLoaded.BodyMap && DataLoaded.Endpoints && DataLoaded.Questions && DataLoaded.Rules)
            {
                DataLoaded.Done = true;
            }
        });
    }
    if (param == 'Endpoints' || param == null) {

        $.get(AdressObject.Endpoints, function (data, textStatus, jqXHR) 
        {
            Endpoints = TAFFY([]);
            Endpoints.insert(data);
            DataLoaded.Endpoints = true;
            if(DataLoaded.BodyMap && DataLoaded.Endpoints && DataLoaded.Questions && DataLoaded.Rules)
            {
                DataLoaded.Done = true;
            }
        });
    }
    if (param == 'Questions' || param == null) {
        $.get(AdressObject.Questions, function (data, textStatus, jqXHR) {
            Questions = TAFFY([]);
            Questions.insert(data);
            DataLoaded.Questions = true;
            if(DataLoaded.BodyMap && DataLoaded.Endpoints && DataLoaded.Questions && DataLoaded.Rules)
            {
                DataLoaded.Done = true;
            }
        });

    }
    if (param == 'Rules' || param == null) {

        $.get(AdressObject.Rules, function (data, textStatus, jqXHR) {
            Rules = TAFFY([]);
            Rules.insert(data);
            DataLoaded.Rules = true;
            if(DataLoaded.BodyMap && DataLoaded.Endpoints && DataLoaded.Questions && DataLoaded.Rules)
            {
                DataLoaded.Done = true;
            }
        });
      
    }




}