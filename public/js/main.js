$(document).ready(function(){
    $('.delete_user').on('click', deleteUser);
});

function deleteUser(){
    var confirmation = confirm("Are you sure" + $('.delete_user').data('id'));
    if(confirmation){
       $.ajax({
           type:'DELETE',
           url:'/band/delete/'+$(this).data('id')
       }).done(function(response){
           window.location.replace('/');
       });
    }else{
        return false;
    }
}