
// Global variables are accessible by any functions below 
var total_questions = 2;
var correct_count = 0;
var current = 0;
var prompts_per_question = 3;
var all_prompts_indexes = new Array(30);
var answer = prompts_per_question; // Legitimate range for answer is (0<= to < prompts_per_question). Set this to be prompts_per_question means that there is no answer chosen	

// Call the load XML Document
function start()
{
	loadXMLDoc(); //Activate this line when running up in the server. Deactivate the line below
	//local(); //Activate this line to process local sample. Deactivate the line above
	current = 0; //after every restart, reset the current counter to zero		
	nextButton.disabled = false; 	
}

function local() //This function is used to run locally on the client side
{
	ques_bank = ["abacus,frame with balls for calculating       	","abate,to lessen to subside        ","abdication,giving up control authority        ","aberration,straying away from what is normal      ","abet,help/encourage smb (in doing wrong)     ","abeyance,suspended action          ","abhor,to hate to detest        ","abide,be faithful to endure        ","abjure,promise or swear to give up      ","abraded,rubbed off worn away by friction      ","abrogate,repeal or annul by authority       ","abscond,to go away suddenly (to avoid arrest)     ","abstruse,difficult to comprehend obscure        "]
	all_prompts_indexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
	
}

// Load XML
function loadXMLDoc() //create dynamic content of the questions
//This function returns two global variables: ques_bank and all_prompts_indexes (including unique stems and distractors)
{
	var xmlhttp;
	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();
	  }
	else
	  {// code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }
	xmlhttp.onreadystatechange=function()
	  {
	  if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
		var text = xmlhttp.responseText; //text is a local variable. It takes effect only within this function's scope
		
		ques_bank=text.split('\n');		//If you assign a value to a variable that has not been declared, it will automatically become a GLOBAL variable.	
		var population = Array.apply(null, {length: ques_bank.length}).map(Number.call, Number)									
		//randomly sample 30 unique prompts (=prompts per question x total_questions) 
		all_prompts_indexes = _.sample(population, prompts_per_question*total_questions); //till here, a set of unique question indexes is chosen.									
		}
	  }
	xmlhttp.open("GET","wordlist.txt",true);
	xmlhttp.send();
	question_display();
}
//Display question, one by one
function question_display(){ // this function accepts no argument, it will repeat until current reach the max number of questions
	document.getElementById('quiz').style.visibility="visible"; //activate the 		
	if (current < total_questions)// access the question_indexes array to identify the question
	{	
		document.getElementById('result').innerHTML = ""; //Clear last result display
		document.getElementById('order').innerHTML = "Question "+(current+1).toString()+":";
		myquiz.reset();
		submitButton.disabled = false;
		nextButton.disabled = true;			
		var prompt_set = new Array(prompts_per_question);			
		key = Math.floor((Math.random() * prompts_per_question) + 0); //this is the answer key
		for (prompt_id = 0;prompt_id <prompts_per_question; prompt_id = prompt_id + 1)
		{
			prompt_set[prompt_id] = ques_bank[all_prompts_indexes[current+prompt_id*total_questions]];			
			var entry_line = prompt_set[prompt_id]
			var entry = entry_line.split(",");	
			if (prompt_id == key)
			{
				document.getElementById('main').innerHTML = entry[0];
			}																
			document.getElementById(prompt_id.toString()).innerHTML = entry[1];												
		}
		current = current + 1;
	}
	else
	{
		var result_display = "Your total result is " + correct_count.toString() + "/" + total_questions.toString() + ". Click Start to take another test." 
		document.getElementById('result').innerHTML = result_display;
		nextButton.disabled = true;		
	}
}	

//Submit button handler
function submit()
{
	var thequestion=eval("document.myquiz.question1")
	for (i = 0; i<prompts_per_question;i = i+1)
	{
		if (thequestion[i].checked==true)				
		{
			answer = i;
		}
	}		
	if (answer <prompts_per_question)
	{
		if (answer == key)
		{
			document.getElementById('result').innerHTML = "Correct!";
			correct_count = correct_count+1;
		}
		else
		{
			document.getElementById('result').innerHTML = "Incorrect!";
		}
		submitButton.disabled = true;
		nextButton.disabled = false;
		answer = prompts_per_question; //this is to clear the variable answer in next question
	}
	else
	{
		document.getElementById('result').innerHTML = "Opps! You forgot to choose one answer!";
	}
}

//Initialization upon page load
function initialization()
{
	document.getElementById('quiz').style.visibility="hidden";
	submitButton.disabled = true;
	nextButton.disabled = true;
}