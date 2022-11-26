//Init


$(document).ready(function () {


    FetchAndIniateData();
    if (typeof (AllReadyTimer) == 'undefined') {
        var AllReadyTimer = setInterval(function () {
            if (DataLoaded.Done) {
                clearInterval(AllReadyTimer);
                $('.top.menu .item').tab();
                DisplayTable('RulesTable');
            }
        }, 100);
    }

});



// RULES REGION

function removeRuleFuction(ruleID, lokalisering) {
    var removebutton = document.createElement('div');
    removebutton.style.cssText = "float:left;";
    removebutton.innerHTML = '<i class="close big grey icon"></i>';
    removebutton.ruleID = ruleID;
    removebutton.id = 'id_' + ruleID;
    //onchange use Rules({'namn':this.rule}).update({duration:'kalle'});
    removebutton.addEventListener('click', function () {

        Rules({ 'id': this.ruleID }).remove();

        // Rules({'namn':this.rule}).update({
        //     tempDBPost
        // });   
        var myTitle = document.getElementById('title_' + lokalisering);
        var myTable = document.getElementById('table_' + lokalisering);
        myTitle.innerHTML = '<i class="dropdown icon"></i>' + lokalisering + ' (' + (myTable.rows.length - 1) + ')'
        this.parentElement.parentElement.remove();
    });
    removebutton.addEventListener('mouseover', function () {

        var popup = document.getElementById(this.id + '_popup');
        if (popup == null) {
            var popup = document.createElement('label');



            popup.id = this.id + '_popup';
            popup.class = 'ui label';

            popup.className = 'ui label';
            popup.innerText = 'Ta bort regel';
            popup.style.position = 'absolute';
            popup.style.display = 'inline';
            popup.style.zIndex = 99;
            popup.style.border = '1px solid darkgrey'
            this.appendChild(popup);
        }
        else{
            popup.style.display = 'inline';
        }




    });
    removebutton.addEventListener('mouseleave', function () {
        var popup = document.getElementById(this.id + '_popup');
        if (popup != null) {
            popup.style.display = 'none';

        }

    });
    return removebutton;
}
function CreateCell(thisRule, typ) {
    MyQuestions = Questions().get();
    var RuleName = thisRule['namn'];
    var RuleID = thisRule['id'];
    var typ = typ;
    var RuleAnswer = thisRule[typ];
    var UniqeID = RuleID + '.' + typ;
    var celltoinsert = document.createElement('td');
    celltoinsert.className = "ui tablecell";
    celltoinsert.id = 'mothercell_' + RuleID + '_' + typ;
    celltoinsert.style.verticalAlign = 'middle';
    celltoinsert.style.border = 0;



    var label = document.createElement('span');
    label.id = 'label_' + UniqeID;
    label.className = "ui label";
    label.innerText = typ;
    label.ruleID = RuleID;
    label.typ = typ;
    label.style.width = "-webkit-fill-available";
    label.addEventListener('mouseover', function () {
        if (this.typ != 'namn' && this.typ != 'utfall' && this.typ != 'lokalisering' && this.typ != 'ny fråga') {

            var popup = document.getElementById(this.id + '_popup');
            if (popup == null) {

                popup = document.createElement('div');
                popup.id = this.id + '_popup';
                popup.class = 'ui label';
                var thisQ = Questions({ 'name': typ }).first();
                popup.className = 'ui  label';
                popup.innerText = thisQ.questionText;
                popup.style.position = 'absolute';
                popup.style.display = 'inline';
                popup.style.zIndex = 99;
                popup.style.border = '1px solid darkgrey'
                this.appendChild(popup);
            }
            else {
                popup.style.display = 'inline';
            }
        }


    });
    label.addEventListener('mouseleave', function () {
        var popup = document.getElementById(label.id + '_popup');
        if (popup != null) {
            popup.style.display = 'none';

        }

    })


    var removebutton = document.createElement('div');
    removebutton.style.cssText = "right:1px; top 1px;"
    removebutton.innerHTML = '<i class="close grey icon" style="float:right;"></i>';
    removebutton.RuleID = RuleID;
    removebutton.id = 'id_Question' +RuleID;
    removebutton.typ = typ;
    //onchange use Rules({'namn':this.rule}).update({duration:'kalle'});
    removebutton.addEventListener('click', function () {
        var tempDBPost = Rules({ 'id': this.RuleID }).first();
        delete tempDBPost[this.typ];
        Rules({ 'id': this.RuleID }).remove();
        Rules.insert(tempDBPost);
        this.parentElement.parentElement.remove();
    });

    removebutton.addEventListener('mouseover', function () {

        var popup = document.getElementById(this.id + '_popup');
        if (popup == null) {
            var popup = document.createElement('label');



            popup.id = this.id + '_popup';
            popup.class = 'ui label';

            popup.className = 'ui label';
            popup.innerText = 'Ta bort frågan från regel';
            popup.style.position = 'absolute';
            popup.style.display = 'inline';
            popup.style.zIndex = 99;
            popup.style.border = '1px solid darkgrey'
            this.appendChild(popup);
        }
        else{
            popup.style.display = 'inline';
        }




    });
    removebutton.addEventListener('mouseleave', function () {
        var popup = document.getElementById(this.id + '_popup');
        if (popup != null) {
            popup.style.display = 'none';

        }

    });


    var Field;
    if (typ == 'new') { // lägg till en redan befintlig fråga
        //Place NEW-button

        celltoinsert.id = RuleID + '_NY';
        //celltoinsert.style.display= 'inline';
        addButton = document.createElement('div');
        addButton.id = 'Addbutton' + RuleID;
        addButton.innerHTML = '<i class="plus big grey circle icon"></i>';
        addButton
        addButton.linkedDropDown = 'DropDown' + RuleID;
        addButton.addEventListener('click', function () {
            document.getElementById(this.linkedDropDown).style.display = 'inline';
            this.style.display = 'none';
            $.ajax({

                url: AdressObject.Questions,
                type: "PUT",
                data: JSON.stringify(Questions().get()),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data, textStatus, jqXHR) {
                    console.log(textStatus);


                    $.ajax({

                        url: AdressObject.Rules,
                        type: "PUT",
                        data: JSON.stringify(Rules().get()),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (data, textStatus, jqXHR) {
                            console.log(textStatus);





                        }
                    });



                }
            });

        });
        addButton.addEventListener('mouseover', function () {

            var popup = document.getElementById(this.id + '_popup');
            if (popup == null) {
                var popup = document.createElement('label');



                popup.id = this.id + '_popup';
                popup.class = 'ui label';

                popup.className = 'ui label';
                popup.innerText = 'Lägg till en fråga';
                popup.style.position = 'absolute';
                popup.style.display = 'inline';
                popup.style.zIndex = 99;
                popup.style.border = '1px solid darkgrey'
                this.appendChild(popup);
            }
            else{
                popup.style.display = 'inline';
            }




        });
        addButton.addEventListener('mouseleave', function () {
            var popup = document.getElementById(this.id + '_popup');
            if (popup != null) {
                popup.style.display = 'none';

            }

        });

        Field = document.createElement('select');
        Field.setAttribute('class', 'ui dropdown');     //Set class
        Field.setAttribute('className', 'ui dropdown'); // set DIV class attribute for IE (?!)
        Field.setAttribute('id', 'DropDown' + RuleID);              // Set uniqeID
        Field.setAttribute('placeholder', 'Välj egenskap');
        Field.style.display = 'none';
        for (Qname in MyQuestions) {
            var ListOption = document.createElement('option');
            ListOption.value = MyQuestions[Qname].name;
            ListOption.text = MyQuestions[Qname].name;
            Field.add(ListOption);
        }
        var AdditionalValues = ['ny fråga'];
        for (Qname in AdditionalValues) {
            var ListOption = document.createElement('option');
            ListOption.value = AdditionalValues[Qname];
            ListOption.text = AdditionalValues[Qname];
            Field.add(ListOption);
        }
        var ListOption = document.createElement('option');
        ListOption.value = '';
        ListOption.text = 'Välj typ...';
        ListOption.disabled = true;
        ListOption.selected = true;
        Field.add(ListOption);
        Field.Celltarget = celltoinsert.id;
        Field.AddbuttonID = 'Addbutton' + RuleID;
        $(Field).change(function () {
            var Fieldcell = document.getElementById(this.Celltarget);
            var CurROw = Fieldcell.parentElement;
            var MyTargetCell = CurROw.insertCell(CurROw.cells.length - 2)
            if (CurROw.cells.length > 4)// if this isnt our first add after 'namn' 'lokalisering' and 'utfall'
            {
                var arrowDiv = document.createElement('td');
                arrowDiv.style.float = 'left';



                var arrow = document.createElement('i');
                arrow.setAttribute('class', 'angle big right icon');
                arrow.setAttribute('className', 'angle big right icon');
                arrow.style.marginTop = '1rem';
                arrow.style.border = 0;
                arrowDiv.appendChild(arrow);
                MyTargetCell.appendChild(arrowDiv);

            }
            MyTargetCell.appendChild(CreateCell(thisRule, Field.value));

            var Addbutton = document.getElementById(this.AddbuttonID);
            Addbutton.style.display = 'inline';
            this.value = '';
            this.style.display = 'none';
        });
        celltoinsert.appendChild(addButton);
        celltoinsert.appendChild(Field);
        return celltoinsert;
    }
    else if (typ == 'ny fråga') { //skapa en ny fråga

        label.style.display = 'none';
        var outerField = document.createElement('div');

        outerField.setAttribute('class', ' ui icon input');
        outerField.setAttribute('className', ' ui icon input');
        outerField.setAttribute('id', 'outer_' + UniqeID);


        var doneMarker = document.createElement('i');
        doneMarker.setAttribute('class', 'add icon');
        doneMarker.setAttribute('id', 'done_' + UniqeID);      //Set class
        doneMarker.setAttribute('className', 'add icon');
        doneMarker.fieldID = UniqeID;
        doneMarker.ruleID = RuleID;
        doneMarker.questionName = '';
        doneMarker.style.pointerEvents = 'all'; // Semantic kapar dessa
        doneMarker.style.zIndex = 99;
        doneMarker.style.opacity = 1;
        doneMarker.style.right = '-0.5rem';
        doneMarker.addEventListener('click', function (e) {
            var outerfield = document.getElementById('outer_' + this.fieldID);
            var textinputfield = document.getElementById('field_' + this.fieldID);
            var myLabel = document.getElementById('label_' + this.fieldID);
            var myanswerDropdown = document.getElementById('DrpDwn_' + textinputfield.id);

            if (textinputfield.state == 'name') {


                var QnameSearch = Questions({ 'name': textinputfield.value }).first();
                if (!QnameSearch) { // Add new Q
                    myLabel.style.display = 'inline-block';
                    myLabel.innerText = textinputfield.value;
                    Questions.insert({ 'name': textinputfield.value });
                    this.questionName = textinputfield.value;
                    textinputfield.value = '';
                    textinputfield.state = 'question';
                    textinputfield.placeholder = 'Ange frågans text..'
                }
                else { // Q already exists
                    alert('Det finns redan en fråga med samma namn..');
                }


            }
            else if (textinputfield.state == 'question') {
                Questions({ 'name': myLabel.innerText }).update({ 'questionText': textinputfield.value });
                label.addEventListener('mouseover', function () {
                    var popup = document.getElementById(this.id + '_popup');

                    if (popup == null) {
                        popup = document.createElement('div');
                        popup.id = label.id + '_popup';
                        popup.class = 'ui big label';
                        popup.className = 'ui massive label';
                        popup.style.border = '1px solid black';
                        popup.style.position = 'absolute';
                        popup.innerText = textinputfield.value;
                        this.appendChild(popup);
                    }

                    popup.style.display = 'inline';




                });
                label.addEventListener('mouseleave', function () {
                    var popup = document.getElementById(this.id + '_popup');
                    if (popup != null) {
                        popup.style.display = 'none';

                    }
                });

                textinputfield.style.display = 'none';
                textinputfield.state = 'answers';
                myanswerDropdown = document.getElementById('DrpDwn_' + textinputfield.id);
                if (myanswerDropdown == null) {
                    var myanswerDropdown = document.createElement('div');
                    var myanswerInput = document.createElement('input');
                    var myanswerOptions = document.createElement('datalist');



                    myanswerDropdown.ruleID = this.ruleID;
                    myanswerDropdown.questionName = this.questionName;
                    myanswerDropdown.setAttribute('id', 'myanswerDropdown');
                    myanswerDropdown.setAttribute('class', 'ui input');

                    myanswerInput.id = 'myanswerInput';
                    myanswerInput.class = 'ui input';
                    myanswerInput.setAttribute('list', "myMenu");
                    myanswerInput.type = "text";
                    myanswerInput.ruleID = this.ruleID;
                    myanswerInput.questionName = this.questionName;


                    myanswerOptions.id = "myMenu";


                    myanswerDropdown.appendChild(myanswerInput);
                    myanswerDropdown.appendChild(myanswerOptions);
                    outerfield.appendChild(myanswerDropdown);

                    // myanswerDropdown.outerHTML = '' +
                    //     '<div id="" class="ui input">' +
                    //     '<input id="myanswerInput" list="myMenu" type="text">' +
                    //     '<datalist id="myMenu">' +
                    //     '</datalist>' +
                    //     '</div>';    

                    // '' +
                    // '<div id="myanswerDropdown" class="ui selection dropdown">'+
                    //     '<input type="hidden" id="myanswerInput" name="myanswerInputName">'+
                    //     '<div class="text" id="myanswerCotent" contenteditable="true"></div>'+
                    //     '<i class="dropdown icon"></i>'+
                    //     '<div id="myMenu" class="menu">'+
                    //     '<div class="item" data-value="Male">Male</div>'+
                    //     '<div class="item" data-value="Female">Female</div>'+
                    //     '</div>'+
                    // '</div>';
                    // myanswerDropdown.id = 'myanswerDropdown';
                    // myanswerDropdown.class = "ui selection dropdown";
                    // myanswerDropdown.questionName = this.questionName;    
                    // myanswerDropdown.ruleID = this.ruleID;   





                    // myanswerDropdown.appendChild(myanswerInput);
                    // myanswerDropdown.appendChild(myanswerOptions);
                    // //myanswerDropdown.appendChild(this);






                }
            }
            else if (textinputfield.state == 'answers') {


                myanswerDropdown = document.getElementById('myanswerDropdown');
                myOptionlist = document.getElementById('myMenu');
                myAnswerinput = document.getElementById('myanswerInput');

                myAnswerinput.addEventListener('change', function () {
                    if (this.value != '') {
                        Rules({ 'id': this.ruleID }).update({ [this.questionName]: this.value });
                    }
                });

                if (myOptionlist != null) {

                    var answers = [];
                    var mySelection = '';

                    if (myAnswerinput.value != '') {


                        var NewOption = document.createElement('option');
                        //NewOption.class = "item";
                        NewOption.value = myAnswerinput.value;
                        NewOption.text = myAnswerinput.value;

                        myOptionlist.appendChild(NewOption);


                        for (option in myOptionlist.options) {

                            if (myOptionlist.options[option].value != null) {
                                answers.push(myOptionlist.options[option].value)
                            }
                        }

                        Questions({ 'name': this.questionName }).update({ answers });


                    }
                }
                myAnswerinput.value = '';

            }

        });

        // set DIV class attribute for IE (?!)
        Field = document.createElement('input');
        Field.setAttribute('class', 'ui label');        //Set class
        Field.setAttribute('className', 'ui label');    // set DIV class attribute for IE (?!)
        Field.setAttribute('type', 'text')              // set to textinput
        Field.setAttribute('id', 'field_' + UniqeID);              // Set uniqeID
        Field.setAttribute('placeholder', 'Namn på frågan?');
        Field.RuleID = RuleID;
        //Field.oldAnswer = Field.value;
        Field.state = 'name';

        outerField.appendChild(Field);
        outerField.appendChild(doneMarker);



        celltoinsert.appendChild(removebutton);
        celltoinsert.appendChild(label);
        celltoinsert.appendChild(outerField);
        ///Rules({'namn':RuleID}).update({'namn':this.value});
        return celltoinsert;

    }
    else if (typ == 'namn') {

        Field = document.createElement('input');
        Field.setAttribute('class', 'ui input');        //Set class
        Field.setAttribute('className', 'ui input');    // set DIV class attribute for IE (?!)
        Field.setAttribute('type', 'text')              // set to textinput
        Field.setAttribute('id', UniqeID);              // Set uniqeID
        Field.setAttribute('value', RuleAnswer);
        Field.oldAnswer = Field.value;
        Field.RuleID = RuleID;
        Field.addEventListener("blur", function () {
            Rules({ 'id': this.RuleID }).update({ 'namn': this.value });
            console.log('updated namn to ' + this.value)
        });

        celltoinsert.IsName = true;
        celltoinsert.appendChild(label);
        celltoinsert.appendChild(Field);
        ///Rules({'namn':RuleID}).update({'namn':this.value});
        return celltoinsert;

    }
    else if (typ == 'lokalisering') {

        Field = document.createElement('select');
        Field.setAttribute('class', 'ui dropdown');     //Set class
        Field.setAttribute('className', 'ui dropdown'); // set DIV class attribute for IE (?!)
        Field.setAttribute('id', UniqeID);              // Set uniqeID
        Field.RuleID = RuleID;
        Field.addEventListener("change", function () {
            Rules({ 'id': this.RuleID }).update({ 'lokalisering': this.value });

        });
        var ListOption = document.createElement('option');
        ListOption.value = '';
        ListOption.text = 'Välj var...';
        ListOption.disabled = true;
        ListOption.selected = true;
        Field.add(ListOption);
        var Bodyparts = BodyMap().get();                // Get complete current bodymap  
        for (bodypart in Bodyparts) {
            var PossibleOption = Bodyparts[bodypart].bodypart;
            var ListOption = document.createElement('option');
            ListOption.value = PossibleOption;
            ListOption.text = PossibleOption;
            if (PossibleOption == RuleAnswer) {
                ListOption.selected = true;
            }
            Field.add(ListOption);
        }

        //celltoinsert.appendChild(removebutton);
        celltoinsert.appendChild(label);
        celltoinsert.appendChild(Field);
        //Rules({'id':RuleID}).update({'lokalisering':this.value});
        celltoinsert.style.display = 'none';
        return celltoinsert;
    }
    else if (typ == 'utfall') {
        var arrowDiv = document.createElement('td');
        // arrowDiv.style.float = 'left';
        var thRestDiv = document.createElement('td');
        thRestDiv.style.border = 0;
        //  thRestDiv.style.float = 'right';

        var arrow = document.createElement('i');
        arrow.setAttribute('class', 'angle big double right icon');
        arrow.setAttribute('className', 'angle big double right icon');
        arrow.style.marginTop = '1rem';
        arrow.style.border = 0;
        arrowDiv.appendChild(arrow);

        Field = document.createElement('select');
        Field.setAttribute('class', 'ui dropdown');     //Set class
        Field.setAttribute('className', 'ui dropdown'); // set DIV class attribute for IE (?!)
        Field.setAttribute('id', UniqeID);              // Set uniqeID
        Field.RuleID = RuleID;
        Field.addEventListener("change", function () {
            Rules({ 'id': this.RuleID }).update({ 'utfall': this.value });

        });
        var ListOption = document.createElement('option');
        ListOption.value = '';
        ListOption.text = 'Välj utfall...';
        ListOption.disabled = true;
        ListOption.selected = true;
        Field.add(ListOption);
        var Recomendations = Endpoints().get();            // Get complete current bodymap  
        for (Recomendation in Recomendations) {
            var PossibleOption = Recomendations[Recomendation].text;
            var ListOption = document.createElement('option');
            ListOption.value = PossibleOption;
            ListOption.text = PossibleOption;
            if (PossibleOption == RuleAnswer) {
                ListOption.selected = true;
            }
            Field.add(ListOption);
        }
        //celltoinsert.appendChild(arrow);
        //thRestDiv.appendChild(removebutton);
        thRestDiv.appendChild(label);
        thRestDiv.appendChild(Field);


        celltoinsert.appendChild(arrowDiv);
        celltoinsert.appendChild(thRestDiv);
        //Rules({'id':RuleID}).update({'utfall':this.value});
        return celltoinsert;
    }
    else {

        var OurQuestions = Questions({ 'name': typ }).first();            // Get complete current bodymap  
        if (typeof (OurQuestions) != 'undefined') {
            Field = document.createElement('select');
            Field.RuleID = RuleID;
            Field.typ = typ;
            Field.addEventListener("change", function (e) {

                Rules({ 'id': this.RuleID }).update({ [this.typ]: this.value });

            });

            Field.setAttribute('class', 'ui dropdown');     //Set class
            Field.setAttribute('className', 'ui dropdown'); // set DIV class attribute for IE (?!)
            Field.setAttribute('id', UniqeID);              // Set uniqeID
            var ListOption = document.createElement('option');
            ListOption.value = '';
            ListOption.text = 'Välj svar...';
            ListOption.disabled = true;
            ListOption.selected = true;
            Field.add(ListOption);
            for (PossibleOption in OurQuestions.answers) {
                var ListOption = document.createElement('option');
                ListOption.value = OurQuestions.answers[PossibleOption];
                ListOption.text = OurQuestions.answers[PossibleOption];
                if (OurQuestions.answers[PossibleOption] == RuleAnswer) {
                    ListOption.selected = true;
                }
                Field.add(ListOption);
            }
        }

        celltoinsert.appendChild(removebutton);
        celltoinsert.appendChild(label);
        celltoinsert.appendChild(Field);            // Add Field to created tablecell
        //Rules({'id':RuleID}).update({ [Field.typ] :this.value});
        return celltoinsert;


    }
}
function SaveRules() {

    $.ajax({

        url: AdressObject.Questions,
        type: "PUT",
        data: JSON.stringify(Questions().get()),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            console.log(textStatus);
            $.ajax({

                url: AdressObject.Rules,
                type: "PUT",
                data: JSON.stringify(Rules().get()),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data, textStatus, jqXHR) {
                    console.log(textStatus);




                }
            });




        }
    });
}
function CreateNewRule(lokal_Table, lokalisering) {
    var MyTable = document.getElementById(lokal_Table);
    var row = MyTable.insertRow(MyTable.rows.length) // Add row to table
    row.className = "RulesTableRow"
    row.insertCell(0); // Create space for namn
    row.insertCell(1);// Create space for lokalisering
    row.insertCell(2);// Create space for utfall
    var NewRecord = { "id": lokal_Table + MyTable.rows.length, "namn": "", "lokalisering": lokalisering, "utfall": '' };
    Rules.insert(NewRecord);
    var thisRule = Rules({ "id": lokal_Table + MyTable.rows.length }).first();
    for (typ in thisRule) {

        if (typ != '___id' && typ != '___s' && typ != 'id') { // Added by Taffy DB
            
                    var CreatedCell = CreateCell(thisRule, typ);
                    var CellIndex;
                    if (typ == 'namn') {
                        row.cells[0].appendChild(removeRuleFuction(thisRule.id, thisRule.lokalisering));
                        row.cells[0].appendChild(CreatedCell); //Add cell to row @ first pos
                    }
                    else if (typ == 'lokalisering') {
                        row.cells[1].appendChild(CreatedCell); //Add cell to row @ second pos
                    }
                    else if (typ == 'utfall') {
                        row.cells[row.cells.length - 1].appendChild(CreatedCell);  //Add cell to row @ last pos
                    }



        }
    }
    row.appendChild(CreateCell(thisRule, 'new'));

   



}
//Question Region


// Common Region
function DisplayTable(TableName) {

    if (TableName == 'RulesTable') {
        //var MyTable = document.getElementById(TableName);
        //MyTable.innerHTML = '';
        var MyRules = Rules().get();
        var MyBodyMap = BodyMap().get();
        document.getElementById('mainDiv').innerHTML = '<p><h2>Redigera regler</h2></p><br></br>';


        var sortableBodyParts = [];
        for (var Bodypart in MyBodyMap) {
            var mypart = MyBodyMap[Bodypart].bodypart;
            if (sortableBodyParts.indexOf(mypart) == -1) {
                sortableBodyParts.push(mypart);
            }
        }
        sortableBodyParts.sort();
        for (var Bodypart in sortableBodyParts) {
            var mypart = sortableBodyParts[Bodypart];



            var dragspel = document.createElement('div');
            document.getElementById('mainDiv').appendChild(dragspel);
            dragspel.outerHTML = '<div class="ui styled fluid accordion"><div id="title_' + mypart + '" class="title"><i class="dropdown icon"></i>' +
                mypart + '</div><div id="FrameFor' + mypart + '" class="content"></div></div>';



            var MyTable = document.createElement('table');
            MyTable.id = 'table_' + mypart;
            MyTable.className = "ui striped table"
            MyTable.style.width = '100%';

            var frameforTable = document.getElementById('FrameFor' + mypart);


            frameforTable.appendChild(MyTable);

            var CreateNewRuleButton = document.createElement('button');
            CreateNewRuleButton.className = "ui button";
            //CreateNewRuleButton.style.float = 'left';

            CreateNewRuleButton.innerText = 'NY REGEL';
            CreateNewRuleButton.lokalisering = mypart;
            CreateNewRuleButton.addEventListener('click', function () {
                CreateNewRule('table_' + this.lokalisering, this.lokalisering);
            });

            var SaveRuleButton = document.createElement('button');
            SaveRuleButton.className = "ui button";
            SaveRuleButton.style.float = 'right';

            SaveRuleButton.innerText = 'SPARA';
            SaveRuleButton.addEventListener('click', function () {
                SaveRules();
            });

            frameforTable.appendChild(CreateNewRuleButton);
            frameforTable.appendChild(SaveRuleButton);



        }


        var sortable = [];
        for (var rule in MyRules) {
            sortable.push([MyRules[rule].lokalisering, MyRules[rule].id]);
        }

        sortable.sort();
        // var MyRulesNameArray = [];
        // for (regel in MyRules) {
        //     MyRulesNameArray.push(MyRules[regel].namn);
        // }
        // MyRulesNameArray.sort(); // sort alphabetically


        for (regel in sortable) {
            var thisRule = Rules({ 'id': sortable[regel][1] }).first();




            var MyTable = document.getElementById('table_' + thisRule.lokalisering);

            var myTitle = document.getElementById('title_' + thisRule.lokalisering);

            myTitle.innerHTML = '<i class="dropdown icon"></i>' + thisRule.lokalisering + ' (' + (MyTable.rows.length + 1) + ')'


            var row = MyTable.insertRow(MyTable.rows.length) // Add row to table
            row.id = 'rule_' + thisRule.name + '_' + parseInt(MyTable.rows.length);
            row.className = "RulesTableRow"
            row.insertCell(0); // Create space for namn
            row.insertCell(1);// Create space for lokalisering
            row.insertCell(2);// Create space for utfall

            for (typ in thisRule) {

                //row = document.getElementById('rule_' + thisRule.name + '_' + parseInt(MyTable.rows.length));

                if (typ != '___id' && typ != '___s' && typ != 'id') { // Added by Taffy DB
                    var CreatedCell = CreateCell(thisRule, typ);
                    var CellIndex;
                    if (typ == 'namn') {
                        row.cells[0].appendChild(removeRuleFuction(thisRule.id, thisRule.lokalisering));
                        row.cells[0].appendChild(CreatedCell); //Add cell to row @ first pos
                    }
                    else if (typ == 'lokalisering') {
                        row.cells[1].appendChild(CreatedCell); //Add cell to row @ second pos
                    }
                    else if (typ == 'utfall') {
                        row.cells[row.cells.length - 1].appendChild(CreatedCell);  //Add cell to row @ last pos
                    }
                    else {

                        CellSpace = row.insertCell(row.cells.length - 1); //Add cell to row @ second last pos
                        if (row.cells.length > 4)// if this isnt our first add after 'namn' 'lokalisering' and 'utfall'
                        {
                            var arrowDiv = document.createElement('td');
                            arrowDiv.style.float = 'left';



                            var arrow = document.createElement('i');
                            arrow.setAttribute('class', 'angle big right icon');
                            arrow.setAttribute('className', 'angle big right icon');
                            arrow.style.marginTop = '1rem';
                            arrow.style.border = 0;
                            arrowDiv.appendChild(arrow);
                            CellSpace.appendChild(arrowDiv);

                        }

                        CellSpace.appendChild(CreatedCell);
                    }


                }
            }
            row.appendChild(CreateCell(thisRule, 'new'));
        }
    }

    $('.ui.accordion')
        .accordion()
        ;



}











// Trash Region
// function If_Element_Exists_Then(action, id, wildcard, type, Miscvariable) {
//     if (action == "") {
//         if (wildcard) {
//             var elementtofind = document.querySelectorAll(type + '[id*="' + id + '"]');
//             if (elementtofind.length != 0) {
//                 return true;
//             }
//             else {
//                 return false;
//             }
//         }
//         else {
//             var elementtofind = document.getElementById(id);
//             if (elementtofind != null) {
//                 return true;
//             }
//             else {
//                 return false;
//             }
//         }
//     }
//     else if (action == "remove") {
//         if (wildcard) {
//             var elementToRemove = document.querySelectorAll(type + '[id*="' + id + '"]');
//             Array.prototype.forEach.call(elementToRemove, function (singleElement) {

//                 singleElement.parentNode.removeChild(singleElement);

//             });

//         }
//         else {
//             var elementToRemove = document.getElementById(id);
//             if (elementToRemove != null) {

//                 elementToRemove.parentNode.removeChild(elementToRemove);


//             }
//         }
//     }
//     else if (action == "return it") {

//         if (wildcard) {
//             var elementFound = document.querySelectorAll(type + '[id*="' + id + '"]');
//             return elementFound;

//         }
//         else {
//             var elementFound = document.getElementById(id);
//             return elementFound;

//         }


//     }
//     else {
//         return null;
//     }
// }
// function SavePriorRule(RuleNumber, RuleBody) {

//     Rules.insert(RuleBody);
// }
// append column to the HTML table
// function appendColumn(tabellNamn, CellText, toHeader) {
//     var tbl = document.getElementById(tabellNamn) // table reference
//     // open loop for each row and append cell
//     if (toHeader) {
//         createCell(tbl.tHead.rows[0].insertCell(tbl.tHead.rows[0].insertCell.length), CellText, 'col', CellText, true);
//     }
//     else {
//         for (i = 0; i < tbl.rows.length; i++) {
//             createCell(tbl.rows[i].insertCell(tbl.rows[i].cells.length), '', 'col', CellText, false);
//         }
//     }
// }
// append row to the HTML table
// function appendRow(tabellNamn, rule) {
//     var tbl = document.getElementById(tabellNamn) // table reference
//     row = tbl.insertRow(tbl.rows.length)     // append table row

//     // insert table cells to the new row
//     if (rule != null) {
//         for (i = 0; i < tbl.tHead.rows[0].cells.length; i++) {
//             var UniqeID = 'rule_' + tbl.tHead.rows[0].cells[i].id + '_' + parseInt(tbl.rows.length);
//             var inserted = false;
//             var HeaderName = tbl.tHead.rows[0].cells[i].id;

//             for (Q in rule) {


//                 if (tbl.tHead.rows[0].cells[i].id == rule[Q].name) {


//                     if (Q == 'namn') {
//                         inserted = true;
//                         createCell(row.insertCell(i), rule[Q].answer, 'input', UniqeID, false);
//                     }
//                     else if (Q == 'lokalisering') {
//                         inserted = true;

//                         var Bodyparts = Bodymap().get();
//                         var optionsToSend = [];
//                         for (bodypart in Bodyparts) {

//                             var PossibleOption = Bodyparts[bodypart].bodypart;
//                             var result = $.grep(optionsToSend, function (e) { return e.value == PossibleOption; });
//                             if (result.length == 0) {
//                                 if (PossibleOption == rule[Q].answer) {
//                                     optionsToSend.push(
//                                         {
//                                             text: PossibleOption,
//                                             value: PossibleOption,
//                                             selected: true
//                                         });
//                                 }
//                                 else {
//                                     optionsToSend.push(
//                                         {
//                                             text: PossibleOption,
//                                             value: PossibleOption
//                                         });

//                                 }
//                             }

//                         }

//                         createCell(row.insertCell(i), optionsToSend, 'select', UniqeID, false);


//                     }
//                     else if (Q == 'utfall') {
//                         inserted = true;

//                         var curEndpoint = Endpoints().get();
//                         var optionsToSend = [];
//                         for (Answer in curEndpoint) {

//                             var PossibleOption = curEndpoint[Answer].namn;

//                             if (PossibleOption == rule[Q].answer) {
//                                 optionsToSend.push(
//                                     {
//                                         text: PossibleOption,
//                                         value: PossibleOption,
//                                         selected: true
//                                     });
//                             }
//                             else {
//                                 optionsToSend.push(
//                                     {
//                                         text: PossibleOption,
//                                         value: PossibleOption
//                                     });

//                             }

//                         }

//                         createCell(row.insertCell(i), optionsToSend, 'select', UniqeID, false);
//                     }

//                     else {

//                         inserted = true;
//                         var optionsToSend = [];
//                         var LoadedQ = Questions({ 'name': Q }).get();
//                         for (Alternative in LoadedQ.answers) {

//                             var PossibleOption = LoadedQ[0].UIs[Alternative];
//                             if (PossibleOption == rule[Q].answer) {
//                                 optionsToSend.push(
//                                     {
//                                         text: PossibleOption,
//                                         value: PossibleOption,
//                                         selected: true
//                                     });

//                             }
//                             else {
//                                 optionsToSend.push(
//                                     {
//                                         text: PossibleOption,
//                                         value: PossibleOption
//                                     });

//                             }
//                         }

//                     }

//                     createCell(row.insertCell(i), optionsToSend, 'select', UniqeID, false);

//                 }
//             }

//         }

//         if (!inserted) {   // get Q

//             var UniqeID = 'rule_' + tbl.tHead.rows[0].cells[i].id + '_' + parseInt(tbl.rows.length);
//             console.log(UniqeID);
//             var HeaderName = tbl.tHead.rows[0].cells[i].id;
//             if (HeaderName == 'namn') {
//                 inserted = true;
//                 createCell(row.insertCell(i), 'Namn', 'input', UniqeID, false);
//             }
//             else if (HeaderName == 'lokalisering') {

//                 inserted = true;

//                 var Bodyparts = BodyMap().get();
//                 var optionsToSend = [];
//                 for (bodypart in Bodyparts) {

//                     var PossibleOption = Bodyparts[bodypart].bodypart;
//                     var result = $.grep(optionsToSend, function (e) { return e.value == PossibleOption; });
//                     if (result.length == 0) {
//                         optionsToSend.push(
//                             {
//                                 text: PossibleOption,
//                                 value: PossibleOption
//                             });
//                     }



//                 }
//                 //get empty option, no selection done yet
//                 optionsToSend.push(
//                     {
//                         text: '',
//                         value: '',
//                         selected: true
//                     });
//                 createCell(row.insertCell(i), optionsToSend, 'select', UniqeID, false);

//             }
//             else if (HeaderName == 'utfall') {

//                 inserted = true;

//                 var curEndpoint = Endpoints().get();
//                 var optionsToSend = [];
//                 for (Answer in curEndpoint) {

//                     var PossibleOption = curEndpoint[Answer].namn;
//                     optionsToSend.push(
//                         {
//                             text: PossibleOption,
//                             value: PossibleOption,

//                         });


//                 }
//                 //get empty option, no selection done yet
//                 optionsToSend.push(
//                     {
//                         text: '',
//                         value: '',
//                         selected: true
//                     });
//                 createCell(row.insertCell(i), optionsToSend, 'select', UniqeID, false);

//             }
//             else {
//                 var curQ = Questions({ 'name': HeaderName }).get();
//                 var optionsToSend = [];
//                 for (Answer in curQ[0].UIs) {
//                     if (Answer != "0") {
//                         var PossibleOption = curQ[0].UIs[Answer].text;

//                         optionsToSend.push(
//                             {
//                                 text: PossibleOption,
//                                 value: PossibleOption
//                             });

//                     }
//                 }
//                 //get empty option, no selection done yet
//                 optionsToSend.push(
//                     {
//                         text: '',
//                         value: '',
//                         selected: true
//                     });
//                 createCell(row.insertCell(i), optionsToSend, 'select', UniqeID, false);
//             }
//         }
//     }

//     else {
//         for (i = 0; i < tbl.tHead.rows[0].cells.length; i++) {

//             var inserted = false;

//             var UniqeID = 'rule_' + tbl.tHead.rows[0].cells[i].id + '_' + parseInt(tbl.rows.length);
//             console.log(UniqeID);
//             var HeaderName = tbl.tHead.rows[0].cells[i].id;

//             if (HeaderName == 'namn') {
//                 inserted = true;
//                 createCell(row.insertCell(i), 'Namn', 'input', UniqeID, false);
//             }
//             else if (HeaderName == 'lokalisering') {

//                 inserted = true;

//                 var Bodyparts = Bodymap().get();
//                 var optionsToSend = [];
//                 for (bodypart in Bodyparts) {

//                     var PossibleOption = Bodyparts[bodypart].bodypart;
//                     var result = $.grep(optionsToSend, function (e) { return e.value == PossibleOption; });
//                     if (result.length == 0) {
//                         optionsToSend.push(
//                             {
//                                 text: PossibleOption,
//                                 value: PossibleOption
//                             });
//                     }



//                 }
//                 //get empty option, no selection done yet
//                 optionsToSend.push(
//                     {
//                         text: '',
//                         value: '',
//                         selected: true
//                     });
//                 createCell(row.insertCell(i), optionsToSend, 'select', UniqeID, false);

//             }
//             else if (HeaderName == 'utfall') {

//                 inserted = true;

//                 var curEndpoint = Endpoints().get();
//                 var optionsToSend = [];
//                 for (Answer in curEndpoint) {

//                     var PossibleOption = curEndpoint[Answer].namn;
//                     optionsToSend.push(
//                         {
//                             text: PossibleOption,
//                             value: PossibleOption,

//                         });


//                 }
//                 //get empty option, no selection done yet
//                 optionsToSend.push(
//                     {
//                         text: '',
//                         value: '',
//                         selected: true
//                     });
//                 createCell(row.insertCell(i), optionsToSend, 'select', UniqeID, false);

//             }
//             else {

//                 // get Q
//                 var curQ = Questions({ 'name': HeaderName }).get();
//                 var optionsToSend = [];
//                 for (Answer in curQ[0].UIs) {
//                     if (Answer != "0") {
//                         var PossibleOption = curQ[0].UIs[Answer].text;

//                         optionsToSend.push(
//                             {
//                                 text: PossibleOption,
//                                 value: PossibleOption
//                             });

//                     }
//                 }
//                 //get empty option, no selection done yet
//                 optionsToSend.push(
//                     {
//                         text: '',
//                         value: '',
//                         selected: true
//                     });
//                 createCell(row.insertCell(i), optionsToSend, 'select', UniqeID, false);


//             }









//         }
//     }
// }


// create DIV element and append to the table cell


// function capitalizeFirstLetter(string) {
//     return string.charAt(0).toUpperCase() + string.slice(1);
// }
// function createCell(text, style, id, label) {
//     var cell = document.createElement('td');
//     if (label) {


//         var div = document.createElement('div'); // create DIV element
//         txt = document.createTextNode(text); // create text node
//         div.appendChild(txt);                    // append text node to the DIV
//         div.setAttribute('class', style);        // set DIV class attribute
//         div.setAttribute('className', style);    // set DIV class attribute for IE (?!)
//         cell.setAttribute('id', id);
//         cell.appendChild(div);                   // append DIV to the table cell

//     }
//     else {

//         if (style == 'input') {
//             var div = document.createElement('input'); // create DIV element
//             div.setAttribute('class', 'ui input');
//             div.setAttribute('type', 'text')       // set DIV class attribute
//             div.setAttribute('className', 'ui input');    // set DIV class attribute for IE (?!)
//             div.setAttribute('id', id);
//             div.setAttribute('value', text);
//             cell.setAttribute('id', 'cell_' + id);

//             cell.appendChild(div);
//         }
//         else if (style == 'select') {
//             var myselct = document.createElement('select');

//             myselct.setAttribute('class', 'ui dropdown');
//             myselct.setAttribute('type', '')       // set DIV class attribute
//             myselct.setAttribute('className', 'ui dropdown');    // set DIV class attribute for IE (?!)
//             myselct.setAttribute('id', id);
//             cell.setAttribute('id', 'cell_' + id);
//             cell.appendChild(myselct);

//             for (op in text) {
//                 var tempOP = document.createElement('option');
//                 tempOP.value = text[op].value;
//                 tempOP.text = text[op].text;
//                 if (text[op].selected) {
//                     tempOP.selected = true;
//                 }
//                 myselct.add(tempOP);



//             }




//             myselct.add(tempOP);
//         }
//         else {

//             var myselct = document.createElement('select');
//             myselct.id = id;
//             myselct.className = "ui dropdown";
//             cell.appendChild(myselct);

//             for (op in text) {
//                 var tempOP = document.createElement('option');
//                 tempOP.value = text[op].value;
//                 tempOP.text = text[op].text;



//                 myselct.add(tempOP);



//             }
//         }

//     }
//     return cell;

// }