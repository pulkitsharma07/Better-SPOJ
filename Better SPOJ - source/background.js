
function matchExact(r, str) {
   var match = str.match(r);
   return match != null && str == match[0];
}

function getpoints(accepted_count)
{
    return (80/(40+accepted_count)).toFixed(2);
}

var loc = $(location).attr('href');

var prob_page = new RegExp("^http:\/\/www.spoj.com\/problems\/[a-z]+\/*.+$");
var spec_page = new RegExp("^http:\/\/www.spoj.com\/problems\/[A-Z0-9]+\/$");

if(matchExact(prob_page,loc))
{
  
  
  var problem_table_ambiguous  = $("table.problems");
    var problem_table = problem_table_ambiguous[problem_table_ambiguous.length - 1];
    if(problem_table.rows[1].cells.length == 6) //user is logged in
    {
      var prob_name_ind = 2;
      var prob_points_ind = 4; 
    }
    else
    {
      var prob_name_ind = 1;
      var prob_points_ind = 3;
    }
     num = problem_table.rows.length;
     for(i = 1; i <= num ; i++)
    {
      prob_name = problem_table.rows[i].cells[prob_name_ind].getElementsByTagName("b")[0]; //innerHTML
      prob_points = problem_table.rows[i].cells[prob_points_ind].getElementsByTagName("a")[0]; //title
      prob_code = problem_table.rows[i].cells[prob_points_ind-1].getElementsByTagName("a")[0]; //title
      parsed_points = prob_points.title;
      parsed_points = parsed_points.substr(6,parsed_points.indexOf("points"));
      parsed_prob_code = prob_code.innerHTML.trim();
      //localStorage[parsed_prob_code]=parsed_points;
      prob_name.innerHTML = '<strong>'+prob_name.innerHTML+'</strong><strong style="font-size: 8px; padding: 0px 0px 0px 15px;color : #BB2B2B " align="right">'+String(parsed_points)+'</strong>' ;
    }
}

if(matchExact(spec_page,loc))
{
    console.log("HERE");
    var code_obj =$("div.prob table:nth-of-type(1)")[0].rows[0].cells[0].getElementsByTagName("h2")[1];
    var code = code_obj.innerHTML.substr(14);
        var page_code;

   var xhr = new XMLHttpRequest();
   xhr.open("GET", "/ranks/"+code+"/", true);
   xhr.onreadystatechange = function() {
   if (xhr.readyState == 4) {
     page_code = String(xhr.responseText);
     var zz = $(page_code);
     var pq = zz.find("#maintable > tbody > tr:nth-child(2) > td.content0 > table > tbody > tr:nth-child(2) > td > table.problems > tbody > tr.lightrow > td:nth-child(1)");
     var points = getpoints(parseInt(pq[0].innerHTML));
     code_obj.innerHTML = code_obj.innerHTML + '<i> ('+points+' points)</i>';
     //console.log(points);
   }
  }

  xhr.send();    
}
