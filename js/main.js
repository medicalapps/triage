//Start
var Debug = false; // ENABLES CONSOLE OUTPUT FOR DEBUG
var LocalDebug = false;
var MainloopIntervallDuration = 200; //MAIN LOOP TIMER INTERVALL
var PersonalSettings;

var Actions = {
    Append: 'Append',
    HideQ: 'HideQ',
    SetCurrentState: 'SetCurrentState',
    SetQuestionParameter: 'SetQuestionParameter',

};
var States = {
    Intro: 'Intro',
    PointOnModel: 'PointOnModel',
    GetNext: 'GetNext',
    DisplayCurrent: 'DisplayCurrent',
    PendingInput: 'PendingInput',
    Assesment: 'Assesment',
    Summery: 'Summery',
    Verdict: 'Verdict',

    Progression:
    {
        Start: 'Start',
        Ask: 'Ask',
        Summery: 'Summery',
        Verdict: 'Verdict',
    },
};
var CurrentState = {
    Progression: States.Progression.AskMandatoryQs,
    Substate: States.Intro,
    CurrentQ: {},
    SavedRulesForNextAssesment: [],
    QsQue: [],
    Assesment: []
};


var nextQ = '';
var Answers = {};
var Presets = {};


function Assesment() {
    var RemainingRules = [];
    var allrules = Rules().get();


    var DebugDiv = document.getElementById('DebugDiv');
    DebugDiv.innerHTML = '<h2>Debug info:</h2><br>';

    for (rule in allrules) //For every rule we got
    {
        var RuleWeAreLookingAt = allrules[rule]; // create var for this specific rule
        var Excluded = false; // Should it be exluded from remaining rules?
        for (myAnswer in Answers) // For every curruent answers
        {
            var MyGivenAnswer = Answers[myAnswer];

            for (QInThisRule in Object.keys(RuleWeAreLookingAt)) // for every q in this rule 
            {
                var thisruleQ = Object.keys(RuleWeAreLookingAt)[QInThisRule];
                if (thisruleQ.indexOf(myAnswer) != -1) // if we have an answer to this Q, lets check what it is..
                {
                    if (MyGivenAnswer != RuleWeAreLookingAt[thisruleQ]) // question answered and was  NOT the same
                    {
                        Excluded = true;// Rule should be exluded 
                    }

                }
            }

        }
        if (Excluded) // A Q in this rule has been answered with at different answer than this rue requiers
        {
            // DO not add this to remianing rules
        }
        else {
            RemainingRules.push(RuleWeAreLookingAt);// Add this rule to remianing
        }

    }
    console.log(RemainingRules);
    if (RemainingRules.length > 1)//We have more than 1 rule left
    {
        DebugDiv.innerText +=  'Följande regler är kvar: '
        for (SingleRule in RemainingRules) {
            DebugDiv.innerText += RemainingRules[SingleRule].namn + ', ';
        }

        var QuestionCounter = {};
        var entries = 0;
        
        for (SingleRule in RemainingRules) {

            for (SingleQ in RemainingRules[SingleRule]) {
                var Exclude = false;
                var Exeptions = ["namn", "lokalisering", "___id", "___s", "utfall", "id"]
                for (execption in Exeptions) {
                    if (SingleQ == Exeptions[execption] || Answers[SingleQ] != null) {
                        Exclude = true;
                    }
                }

                if (QuestionCounter[SingleQ] != null && !Exclude) {
                    QuestionCounter[SingleQ] += 1;
                    entries += 1;

                }
                else if (!Exclude) {
                    QuestionCounter[SingleQ] = 1;
                    entries += 1;
                }

            }
        }


        //Find most frequent Q
        var max = -Infinity;
        
        if (entries > 0) {
            DebugDiv.innerHTML +=  '<br>Följande frågor är kvar: '
        for (question in QuestionCounter)
        {
            DebugDiv.innerText += question + ' ' + QuestionCounter[question] + 'st, ';
        }
            for (question in QuestionCounter) {

                if (QuestionCounter[question] > max) {
                    CurrentState.CurrentQ.Name = question;
                    max = QuestionCounter[question];
                }
            }
            if (LocalDebug) {
                console.log(CurrentState.CurrentQ.Name);
            }
            CurrentState.Substate = States.DisplayCurrent;
        }
        else // No unanswered Qs left
        {
            DebugDiv.innerText +=  'Inga frågor är kvar.';
            for (question in QuestionCounter)
            {
            DebugDiv.innerText += Object.keys(QuestionCounter[question]) + ' ' + QuestionCounter[question];
            }
            // Check if all endpoints are the same
            var priorutfall = '';
            var numberOfUtfall = 0;
            for (regel in RemainingRules) {
                if (priorutfall != RemainingRules[regel].utfall && priorutfall != '') {
                    numberOfUtfall += 1
                }
                priorutfall = RemainingRules[regel].utfall;
            }

            if (numberOfUtfall == 0)// all rules have the same endpoint
            {
                Answers.endpoint = RemainingRules[0].utfall;
            }
            CurrentState.Substate = States.Summery;
        }
    }
    else if (RemainingRules.length == 1) // We have 1 rule left
    {

        DebugDiv.innerText +=  '1 reglel är kvar: '
        for (SingleRule in RemainingRules) {
            DebugDiv.innerText += RemainingRules[SingleRule].namn + ', ';
        }
        for (SingleQ in RemainingRules[0]) {

            if (SingleQ != '___id' && SingleQ != '___s' && SingleQ != 'namn' && SingleQ != 'utfall' && SingleQ != 'id') {
                if (Answers[SingleQ] == null) {
                    CurrentState.CurrentQ.Name = SingleQ;
                    if (LocalDebug) {
                        console.log(CurrentState.CurrentQ.Name);
                    }
                    CurrentState.Substate = States.DisplayCurrent;
                }
            }
        }
        //If we have 1 rule and found 0 unaswered Qs, we are donr
        if (CurrentState.Substate == States.Assesment) {
            Answers.endpoint = RemainingRules[0].utfall;
            CurrentState.Substate = States.Summery;
        }



    }
    else {
        DebugDiv.innerText +=  'Ingen reglel är kvar: '
        //we are done, go to deafault
        //what default?
        if (Presets['Age'] > 65)
        {
            DebugDiv.innerText +=  'Väljer endpoint >65 ';
            Answers.Endpooint = '>65';
        }
        else if(Presets['kön'] == 'man')
        {
            DebugDiv.innerText +=  'Väljer endpoint man ';
            Answers.Endpooint = 'man';
        }
        else if(Presets['kön'] == 'kvinna')
        {
            DebugDiv.innerText +=  'Väljer endpoint kvinna ';
            Answers.Endpooint = 'kvinna';
        }
        else
        {
            DebugDiv.innerText +=  'Väljer endpoint default ';
            Answers.Endpooint = 'default'
        }

        CurrentState.Substate = States.Summery;
    }
}
function displayCurrentQuestion() {
    var CurrentQ = Questions({ name: CurrentState.CurrentQ.Name }).get()[0];
    // special Qs not aswered
    if (CurrentQ.name == '>65') {
        if (Presets['Age'] > 65) {
            Answers['>65'] = "Ja";
        }
        else {
            Answers['>65'] = "Nej";
        }

        CurrentState.Substate = States.Assesment;
    }
    else if (CurrentQ.name == 'kön') {
        if (Presets['kön'] == 'man') {
            Answers['kön'] = "Man";
        }
        else if (Presets['kön'] == 'kvinna') {
            Answers['kön'] = "Kvinna";
        }
        CurrentState.Substate = States.Assesment;
    }
    else {

        var rootdiv = document.getElementById('RootDiv');
        rootdiv.innerHTML = '';

        var QuestionDiv = document.createElement('div');
        QuestionDiv.className = "QuestionDiv";
        QuestionDiv.innerText = CurrentQ.questionText;

        rootdiv.appendChild(QuestionDiv);

        for (answer in CurrentQ.answers) {
            var AnswerButton = document.createElement('button');
            AnswerButton.className = "ui big button";
            AnswerButton.style.padding = '1rem';
            AnswerButton.AnswerTo = CurrentQ.name;
            AnswerButton.innerText = CurrentQ.answers[answer];
            AnswerButton.addEventListener('click', function () {
                Answers[this.AnswerTo] = this.innerText;
                CurrentState.Substate = States.Assesment;
            })
            rootdiv.appendChild(AnswerButton);
        }
        CurrentState.Substate = States.PendingInput;


    }


}
function CreateSummery() {
    var rootdiv = document.getElementById('RootDiv');
    rootdiv.innerHTML = '';

    var summerypartdiv = document.createElement('div');
    summerypartdiv.className = 'summeryDIV';
    summerypartdiv.innerHTML = '<h2>Summering<h2><br>Vi baserar bedömning på följande information:<br>'
    rootdiv.appendChild(summerypartdiv);
    var summerypartdiv = document.createElement('div');
    summerypartdiv.className = 'summeryDIV';
    summerypartdiv.innerText += 'Du är en ' + Presets['kön'] + ' som är ' + Presets['Age'] + ' år gammal';
    rootdiv.appendChild(summerypartdiv);
    var summerypartdiv = document.createElement('div');

    for (answer in Answers) {


        var summerypartdiv = document.createElement('div');
        summerypartdiv.className = 'summeryDIV';
        if (answer == "lokalisering") {

            summerypartdiv.innerText = 'Du har angett att ditt problem är lokliserat till ' + Answers[answer];
            rootdiv.appendChild(summerypartdiv);
        }
        else if (answer != 'endpoint') {
            var question = Questions({ 'name': answer }).first();
            summerypartdiv.innerText = 'På frågan: ' + question.questionText + ' svarar du ' + Answers[answer];
            rootdiv.appendChild(summerypartdiv);
        }

    }

    var summerypartdiv = document.createElement('div');
    summerypartdiv.className = 'summeryDIV';
    summerypartdiv.innerHTML = '<h4>Stämmer detta?</h4>';
    rootdiv.appendChild(summerypartdiv);

    var AnswerButtonYes = document.createElement('button');
    AnswerButtonYes.className = "ui big button";
    AnswerButtonYes.innerText = 'Ja';
    AnswerButtonYes.addEventListener('click', function () {
        CurrentState.Substate = States.Verdict;
    })
    rootdiv.appendChild(AnswerButtonYes);

    var AnswerButtonNo = document.createElement('button');
    AnswerButtonNo.className = "ui big button";
    AnswerButtonNo.innerText = 'Nej';
    AnswerButtonNo.addEventListener('click', function () {
        alert('ingen funktion på denna knapp än, men klart som fan du tryckte på den i alla fall....')
    })
    rootdiv.appendChild(AnswerButtonNo);





}
function PassVerdict() {
    var rootdiv = document.getElementById('RootDiv');
    rootdiv.innerHTML = '';

    if (Answers.endpoint == null)// we have no verdict, go default
    {
        rootdiv.innerHTML += 'Vi rekomenderar :<br>'
        var defaultEndpooint = Endpoints({ "namn": "default" }).get()[0];
        rootdiv.innerHTML += defaultEndpooint.text;
        rootdiv.innerHTML += ' eftersom vi inte kom på något bättre... <br>'
        rootdiv.innerHTML += 'Vänligen klicka denna länk: <a href src="' + defaultEndpooint.link + '" >' + defaultEndpooint.link + '</a>'

    }
    else if (Answers.endpoint == '>65')// Go by default for plus 65
    {

        rootdiv.innerHTML += 'Vi rekomenderar:<br>'
        var Endpooint = Endpoints({ "text": '>65' }).get()[0];
        // in Endpooint is the info on what to do...  
        rootdiv.innerHTML += Endpooint.text + '<br>';

        rootdiv.innerHTML += 'Vänligen klicka denna länk: <a href src="' + Endpooint.link + '" >' + Endpooint.link + '</a>'
    }
    else if (Answers.endpoint == 'Akut')// Go by default for plus 65
    {
        rootdiv.innerHTML += 'Vi rekomenderar:<br>'
        var Endpooint = Endpoints({ "text": 'Akut' }).get()[0];
        // in Endpooint is the info on what to do...  
        rootdiv.innerHTML += Endpooint.text + '<br>';

        rootdiv.innerHT
    }
    else //do our endpoint
    {
        rootdiv.innerHTML += 'Vi rekomenderar:<br>'
        var Endpooint = Endpoints({ "text": Answers.endpoint }).get()[0];
        // in Endpooint is the info on what to do...  
        rootdiv.innerHTML += Endpooint.text + '<br>';

        rootdiv.innerHTML += 'Vänligen klicka denna länk: <a href src="' + Endpooint.link + '>' + Endpooint.link + '</a>'

    }

    CurrentState.Substate = States.PendingInput;

}
if (typeof (InitTimer) === 'undefined') // Not to make to versions
{
    if (!Detector.webgl) {
        Detector.addGetWebGLMessage();
    }
    var InitTimer = setInterval(function () // Set timer waiting for document ready every second
    {
        if (document.readyState == 'complete')  // Document ready,
        {
            if(LocalDebug)
            {
                document.getElementById('DebugDiv').style.display = 'inline';
            }

            clearInterval(InitTimer); // Clear readytimer
            FetchAndIniateData(null); // Init Databases
            getPersonalInfoFromDatabase_AD();
            if (typeof (MainloopTimer) === 'undefined') // Set main / State machine
            {

                var MainloopTimer = setInterval(function ()// Set main / State machine
                {

                    if (DataLoaded.Done && typeof (PersonalSettings) != 'undefined') {
                        if (PersonalSettings.id == 18 || PersonalSettings.id == 22 || PersonalSettings.id == 2 || PersonalSettings.id == 25 || PersonalSettings.id == 16 || PersonalSettings.id == 174) // Check if all data init, and we are the right person     
                        {
                            document.getElementById('fogdiv').style.display = 'none';
                        }
                        if (CurrentState.Substate == States.Intro) {
                            // Do nothing,, as of now  // BANKID n Such,. 
                        }
                        else if (CurrentState.Substate == States.PointOnModel) {
                            CurrentState.Substate = States.PendingInput;
                            initModel();
                            animate();
                        }
                        else if (CurrentState.Substate == States.DisplayCurrent) {
                            displayCurrentQuestion();
                        }
                        else if (CurrentState.Substate == States.PendingInput) {
                            //Wait for input completion
                        }
                        else if (CurrentState.Substate == States.Assesment) {
                            Assesment();
                        }
                        else if (CurrentState.Substate == States.Summery) {
                            CurrentState.Substate = States.PendingInput;
                            document.getElementById('Summery').className = 'current';
                            CreateSummery();
                        }
                        else if (CurrentState.Substate == States.Verdict) {
                            document.getElementById('Recomend').className = 'current';
                            PassVerdict();
                        }
                        else {
                            console.log('Undefinded CurrentState.Substate:' + CurrentState.Substate);
                        }

                    }

                }, MainloopIntervallDuration);
            }
        }
    }, 200);

}
function DisplayPage(page, somatic) {
    document.getElementById('IntroDiv').style.display = 'none';
    document.getElementById('IntroDiv2').style.display = 'none';
    document.getElementById('Triage').style.display = 'none';

    document.getElementById(page).style.display = '-webkit-inline-box';

    if (page == "Triage") {
        document.getElementById(page).style.display = 'inline';
        document.getElementById('questions').className = 'current';

        if (somatic)
            CurrentState.Substate = States.PointOnModel;
        else {
            Answers['lokalisering'] = 'psykisk ohälsa';
            CurrentState.Substate = States.Assesment;
        }

    }


}
function ValidateSocialNumber(sPNum) {
    var numbers = sPNum.match(/^(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)$/);
    var checkSum = 0;

    var d = new Date();
    if (!isDate(sPNum.substring(0, 4), sPNum.substring(4, 6), sPNum.substring(6, 8))) {
        document.getElementById('OkButton').className = 'ui disabled button';
        return false;
    }

    if (numbers == null) { return false; }

    var n;
    for (var i = 3; i <= 12; i++) {
        n = parseInt(numbers[i]);
        if (i % 2 == 0) {
            checkSum += n;
        } else {
            checkSum += (n * 2) % 9 + Math.floor(n / 9) * 9
        }
    }

    if (checkSum % 10 == 0) {
        document.getElementById('OkButton').setAttribute('class', 'ui button');

        var ThirdDigit = parseInt(sPNum.substring(7, 7))
        if (isOdd(ThirdDigit)) {
            Presets['kön'] = 'kvinna';
        }
        else {
            Presets['kön'] = 'man';
        }


        Presets['Age'] = d.getFullYear() - parseInt(sPNum.substring(0, 4));
        if (Presets['Age'] > 65) {
            Presets['över 65'] = 'Ja';
        }
        else {
            Presets['över 65'] = 'Nej';
        }



        return true;

    }


    return false;
}
function isOdd(n) {
    return Math.abs(n % 2) == 1;
}
function getYear(y) { return (y < 1000) ? y + 1900 : y; }
function isDate(year, month, day) {
    month = month - 1; // 0-11 in JavaScript
    var tmpDate = new Date(year, month, day);
    if ((getYear(tmpDate.getYear()) == year) &&
        (month == tmpDate.getMonth()) &&
        (day == tmpDate.getDate())) {

        return true;
    }
    else {


        return false;
    }
}

function getPersonalInfoFromDatabase_AD() {

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.timeout = 5000;
    xmlHttp.ontimeout = function (e) {
        if (LocalDebug)
            console.log("AD request error timeout");

    };
    xmlHttp.onerror = function (e) {
        if (LocalDebug)
            console.log("AD request error error generic");

    };
    xmlHttp.onreadystatechange = function () {

        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            if (xmlHttp.responseText.length > 0) //We have AD connection an no Name
            {
                var data = xmlHttp.responseText;
                var jsonResponse = JSON.parse(data);
                PersonalSettings = jsonResponse;

            }

        }
        else if (xmlHttp.readyState == 4 && xmlHttp.status != 200) // Outside network
        {
            if (LocalDebug)
                console.log("AD request error status " + xmlHttp.status);

        }
    }
    if (Debug) {
        xmlHttp.open("GET", "https://api-test.vasterleden.se/api/authentication/user/", true); // true for asynchronous 
    }
    else {
        xmlHttp.open("GET", "https://api.vasterleden.se/api/authentication/user/", true); // true for asynchronous 
    }

    xmlHttp.withCredentials = true;
    xmlHttp.send(null);

}