//utility function for exact regex matching
function matchExact(r, str) {
   var match = str.match(r);
   return match != null && str == match[0];
}

//utility function to get the points.
function getpoints(accepted_count)
{
    return (80/(40+accepted_count)).toFixed(2);
}

//get the url currently opened
var loc = $(location).attr('href');

//Regex for knowing where the user is
var prob_page = new RegExp("^http:\/\/www.spoj.com\/problems\/classical\/*.+$");
var spec_page = new RegExp("^http:\/\/www.spoj.com\/problems\/[A-Z0-9]+\/$");


//if the user is viewing classical problems
if(matchExact(prob_page,loc))
{
  
  
  //When the user is logged in, There are two tables of the class "problems".  Therefore this check is needed.
  var problem_table_ambiguous  = $("table.problems");
  var problem_table = problem_table_ambiguous[problem_table_ambiguous.length - 1];


    if(problem_table.rows[1].cells.length == 6) //user is logged in
    {
      var prob_name_ind = 2; // Problem's name is on the 2nd column      
    }
    else
    {
      var prob_name_ind = 1;
    }

    var prob_users_ind = prob_name_ind + 2; //Problem's accepted user count is 

    //Number of rows
    num = problem_table.rows.length;

    //For all the rows
     for(i = 1; i <= num-1 ; i++)
    {
      //get the problem name DOM element
      prob_name = problem_table.rows[i].cells[prob_name_ind].getElementsByTagName("b")[0];
      //get the users DOM element
      prob_users = problem_table.rows[i].cells[prob_users_ind].getElementsByTagName("a")[0];
      //Get points
      parsed_points = getpoints(parseInt(prob_users.innerHTML));
      //Modify Problem name DOM element
      prob_name.innerHTML = '<strong>'+prob_name.innerHTML+'</strong><strong style="font-size: 8px; padding: 0px 0px 0px 15px;color : #BB2B2B " align="right">'+String(parsed_points)+' points</strong>' ;
    }
}

//If user is viewing a particular problem
if(matchExact(spec_page,loc))
{
    
    //Get the problem code DOM element (Problem code can be parsed via the current page's url , but as we later need to modify the DOM element it we'll stick with the current method)
    var code_obj =$("div.prob table:nth-of-type(1)")[0].rows[0].cells[0].getElementsByTagName("h2")[1];
    var code = code_obj.innerHTML.substr(14);
    var page_code;

    //We need the number of accepted users in order to calculate the points.
    //But that data is not available on the current page, So we need to get the HTML data from the  'Best solutions' page for the current problem
   var xhr = new XMLHttpRequest();
   xhr.open("GET", "/ranks/"+code+"/", true);
   xhr.onreadystatechange = function() {
   if (xhr.readyState == 4) {
     page_code = String(xhr.responseText); //page code now has the entire HTML code for this page(the 'Best Solutions' page)
     var zz = $(page_code); // Parse DOM
     //Get the Users Accepted DOM element
     var pq = zz.find("#maintable > tbody > tr:nth-child(2) > td.content0 > table > tbody > tr:nth-child(2) > td > table.problems > tbody > tr.lightrow > td:nth-child(1)");
     //Get the points
     var points = getpoints(parseInt(pq[0].innerHTML));
     //Modify the code_obj DOM element to display the points 
     code_obj.innerHTML = code_obj.innerHTML + '<i> ('+points+' points)</i>';     
   }
  }
  xhr.send();

}
