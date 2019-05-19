var all_order ="",page_no =1,customer_email_c =false,customer_school_c = false,product_id_c =false,event_date_c =false;
var _found = false,_another_found = false;
jQuery(document).ready(function(){ ajaxCall(page_no); });
function ajaxCall(){
  var api_url = 'stellatestschool.myshopify.com/admin/api/2019-04/orders.json?page='+page_no+'&status=any',
      key = '3e5967232f459e21aabcc5dbf5488387:aa23dfa15h323b4fafb96d892a4d4504';
  jQuery.ajax({
    url:"https://"+key+"@"+api_url,
    method:"GET",
    success:success_function
  });
}
function success_function(data){
  if(data.orders.length > 0){
    if(all_order == ""){
      	all_order = data;
    }else{
    	all_order.orders.concat(data.orders);
    }
    page_no++;
    ajaxCall();
  }else{
        doValidation(all_order);
  }
}
function doValidation(data){
	//console.log(data);
    var _orders = data.orders;
    var email,created_at,product_id,note;
    if(_orders != null){
      var customer_email_v =jQuery("#customer_email").val(),customer_school_v = jQuery("#customer_school").val(),
          product_id_v =jQuery("#product_id").val(),event_date_v =jQuery("#event_date").val();
      for(var i=0; i<_orders.length; i++){
        var customer_email_c = false;
        var customer_school_c = false;
        var product_id_c = false;
        var event_date_c = false;
        var _customer = _orders[i].customer;
        var note = _customer !=null ? _customer.note:"";
        note = note !=null && note != "" ? note.replace("Your School:","") : "";
        var customer_email,customer_school,product_id,event_date,event_date_y;
        if(_customer !=null){
          customer_email = _customer.email;
          customer_school = _customer.note;
          customer_school = customer_school !=null && customer_school != "" ? customer_school.replace("Your School: ","") : "";
        }

        if(_orders[i].line_items != null){
          product_id = _orders[i].line_items[0].product_id; 
          event_date = _orders[i].created_at;
          for(var j =0; j<_orders[i].line_items.length; j++){
            product_id = _orders[i].line_items[j].product_id; 
          	product_id_c = (product_id != null && product_id == product_id_v) ? true : product_id_c;
          }
          var aDate = new Date(event_date);
          event_date = aDate.getFullYear() +"-"+(aDate.getMonth()) +"-"+ aDate.getDate();
          aDate.setFullYear(aDate.getFullYear() + 1);
          event_date_y = aDate.getFullYear() +"-"+aDate.getMonth() +"-"+ aDate.getDate();
        }
        customer_email_c = (customer_email != null && customer_email == customer_email_v) ? true : customer_email_c;
        event_date_c = (event_date != null && ((event_date_v >= event_date && event_date_v <= event_date) || (event_date_v <= event_date_y && event_date_v <= event_date_y))) ? true : event_date_c;
        customer_school = customer_school.trim();
        customer_school_c = (customer_school != null && customer_school && customer_school_v != null && customer_school_v.indexOf(customer_school.trim()) > -1) ? true : customer_school_c;
        
       	//console.log(customer_email +"=="+ customer_email_v+","+event_date +"=="+ event_date_v+","+customer_school +"=="+ customer_school_v+","+product_id +"=="+ product_id_v);
		if(customer_email_c && event_date_c && customer_school_c && product_id_c){
        	var _found = true;
        }else if(event_date_c && customer_school_c && product_id_c){
        	var _another_found = true;
        }
      }
      if(_found){
        $('#AddToCart-product-prom-template').addClass('disabled').prop('disabled', true).hide();
        $('#disabled-button').show();
        //$('#AddToCartText-product-prom-template').text('Purchased Before');
        //$("#verifybutton").hide();
        $('#verification').text('You have purchased this dress before try another one.');
        return true;
      }else{
        if(_another_found){
          $('#AddToCart-product-prom-template').addClass('disabled').prop('disabled', true).hide();
          $('#disabled-button').show();
          $('#verification').text('Another customer from your school have this dress.');
          return true;
        }else{
          //$('#verification').text('Congrats! You can purchase this dress. You will look unique at your school.');
        }
        return false;
        //$("#verifybutton").on("click", function () {
        //  if(event_date_c && customer_school_c && product_id_c){
        //    $('#AddToCart-product-prom-template').prop('disabled', true);
        //    $('#verification').text('Another customer from your school have this dress.');
        //    return true;
        //  }else{
        //    $('#verification').text('Congrats! You can purchase this dress. You will look unique at your school.');
        //  }
        //});
        //return false;
      }
    }else{
      //alert("false");
      return false;
    }
}
