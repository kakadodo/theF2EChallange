$(function(){
  let mode = 'all';
  let newTaskCount = parseInt(localStorage.getItem('newTaskCount')) || 0;
  let tasksData = JSON.parse(localStorage.getItem('data')) || [];
  let tasksSort = JSON.parse(localStorage.getItem('sort')) || [];

  //header mode toggle
  $('header .nav_list').on('click', function(){
    $('header .nav_list').removeClass('active');
    $(this).addClass('active');
    mode = $(this).data('mode');
    const taskLists = $('.task_lists .task_panel');
    switch(mode){
      case 'all':
        taskLists.show('fast');
        break;
      case 'progress':
        taskLists.show();
        taskLists.filter('.completed').hide('fast');
        break;
      case 'completed':
        taskLists.show();
        taskLists.not('.completed').hide('fast');
        break;
      default:
        break;
    }
  });

  //open add new task panel
  $('.addTask_input').on('click', function(){
    $(this).fadeOut(50);
    $(this).next('.task_panel').slideDown('slow');
  });

  //cancel add new task panel
  $('.btn_cancel').on('click', function(){
    $(this).closest('.task_panel').find('input, textarea').val('');
    $(this).closest('.task_panel').find('.file_info').addClass('d_none');
    $(this).closest('.task_panel').hide().prev('.addTask_input').show();
  });

  //input file onchange listener
  $('.container').on('change', '[id^=task_file]', function(e){
    e.stopPropagation();
    let file = $(this)[0].files[0];
    let info = $(this).closest('.d_flex').find('.file_info');
    info.removeClass('d_none').find('.name').text(file.name);
    info.find('.upload').text((new Date()).toDateString());
  });

  //add new task
  $('#js_addTask').on('click', function(){
    getTaskContent($(this));
    $(this).closest('.task_panel').find('input, textarea').val('');
    $(this).closest('.task_panel').find('.file_info').addClass('d_none');
    $(this).closest('.task_panel').hide().prev('.addTask_input').show();
    //keep task id increase
    newTaskCount++;
    localStorage.setItem('newTaskCount',newTaskCount);
  });

  //edit task
  $('.task_lists').on('click', '.edit_btn', function(e){
    e.preventDefault();
    $(this).addClass('active').closest('.task_panel').find('.task_panel_bottom').slideDown().removeClass('d_none');
    $(this).siblings('.title_input').removeAttr('disabled');
  });

  //cancel edit task
  $('.task_lists').on('click', '.btn_cancel', function(){
    $(this).closest('.task_panel_bottom').slideUp().addClass('d_none').prev('.task_panel_top').find('.edit_btn').removeClass('active').siblings('.title_input').prop('disabled',true);
  });

  //save edit task
  $('.task_lists').on('click', '[id^="js_saveTask"]', function(){
    getTaskContent($(this));
    $(this).closest('.task_panel_bottom').slideUp().addClass('d_none').prev('.task_panel_top').find('.edit_btn').removeClass('active').siblings('.title_input').prop('disabled',true);
  });

  //task completed check listener
  $('.task_lists').on('click', '.completed_check', function(){
    //find task by task id, then use task to find the position of taskData
    let id = $(this).closest('.task_panel').data('id');
    let task = tasksData.find(function(task, i){return task.id == id;});
    let taskIndex = tasksData.indexOf(task);
    $(this).is('.checked')? tasksData[taskIndex].isCompleted = false:tasksData[taskIndex].isCompleted = true;
    $(this).is('.checked')? $(this).removeClass('checked'):$(this).addClass('checked');
    localStorage.setItem('data', JSON.stringify(tasksData));
    renderTask();
  });

  //task star check listener
  $('.task_lists').on('click', '.star_check', function(){
    let id = $(this).closest('.task_panel').data('id');
    let sortIndex = tasksSort.indexOf(id);
    let task = tasksData.find(function(task, i){return task.id == id;});
    let taskIndex = tasksData.indexOf(task);
    $(this).is('.checked')? tasksData[taskIndex].isStar = false:tasksData[taskIndex].isStar = true;
    $(this).is('.checked')? $(this).removeClass('checked'):$(this).addClass('checked');
    //let stared task move to top
    if($(this).is('.checked')){
      tasksSort.unshift(tasksSort.splice(sortIndex,1)[0]);
      localStorage.setItem('sort', JSON.stringify(tasksSort));
    }
    localStorage.setItem('data', JSON.stringify(tasksData));  
    renderTask();
  });

  //task delete listener
  $('.task_lists').on('click', '.delete_btn', function(){
    let id = $(this).closest('.task_panel').data('id');
    let task = tasksData.find(function(task, i){return task.id == id;});
    let taskIndex = tasksData.indexOf(task);
    //delete task from taskData
    tasksData.splice(taskIndex,1);
    localStorage.setItem('data', JSON.stringify(tasksData));
    let sortIndex = tasksSort.indexOf(id);
    //delete task id from taskSort
    tasksSort.splice(sortIndex,1);
    localStorage.setItem('sort', JSON.stringify(tasksSort));
    $(this).closest('.task_panel').fadeOut(function(){renderTask();});
  });

  //sortable tasklists
  $(".task_lists").sortable({
    opacity: 0.5,
    items: ".task_panel:not(.star)"
  });
  $(".task_lists").on("sortupdate", function(){
    tasksSort = $(this).find('.task_panel').map(function(i,task){
      return $(task).data('id');
    }).get();
    localStorage.setItem('sort', JSON.stringify(tasksSort));
  });


  function getTaskContent(btn){
    let panel = btn.closest('.task_panel');
    let data = {
      id: panel.data('id') === undefined? newTaskCount:panel.data('id'),
      title: panel.find('.title_input').val(),
      date: panel.find('[name="task_date"]').val(),
      time: panel.find('[name="task_time"]').val(),
      file: panel.find('[name="task_file"]')[0].files[0] || '',
      fileTime: panel.find('.file_info .upload').text() || '',
      comment: panel.find('[name="task_comment"]').val(),
      isStar: panel.find('[name="completed_check"]').prop('checked'),
      isCompleted: panel.find('[name="star_check"]').prop('checked')
    }
    // console.log(data);
    //if add task...
    if(data.id == newTaskCount){
      tasksData.push(data);
      tasksSort.push(data.id);
    }else{
      //if update task...
      let task = tasksData.find(function(task,i){
        return task.id == data.id;
      });
      let taskIndex = tasksData.indexOf(task);
      tasksData[taskIndex] = data;
    }
    localStorage.setItem('data', JSON.stringify(tasksData));
    localStorage.setItem('sort', JSON.stringify(tasksSort));
    renderTask();
  }

  function renderTask(){
    let template = '';
    let leftTaskCount = 0;
    $.each(tasksSort, function(i, id){
      let task = tasksData.find(function(task, i){
        return task.id == id;
      });
      if(!task.isCompleted){
        leftTaskCount++;
      }
      template += `
        <div data-id="${task.id}" class="task_panel ${task.isStar? 'star': ''} ${task.isCompleted? 'completed': ''}">
          <a href="#" class="delete_btn"><i class="fas fa-trash-alt"></i></a>
          <div class="task_panel_top">
            <div class="d_flex">
              <input type="checkbox" name="completed_check" class="completed_check ${task.isCompleted? 'checked':''}"/>
              <input type="text" placeholder="Type Something Here..." name="title_input" disabled="true" value="${task.title}" class="title_input"/>
              <input type="checkbox" name="star_check" class="star_check ${task.isStar? 'checked':''}"/><a href="#" class="edit_btn"><i class="fas fa-pencil-alt"></i></a>
            </div>
            <div class="task_icons d_flex">
              <li class="icon_date ${task.date? '':'d_none'}"><i class="far fa-calendar-alt"></i><span style="margin-left:5px">${task.date}</span></li>
              <li class="icon_file ml-1 ${task.file? '':'d_none'}"><i class="far fa-file"></i></li>
              <li class="icon_comment ml-1 ${task.comment? '':'d_none'}"><i class="far fa-comment-dots"></i></li>
            </div>
          </div>
          <div class="task_panel_bottom d_none">
            <div class="form_group">
              <h4><i class="far fa-calendar-alt"></i>Deadline</h4>
              <input type="date" placeholder="yyyy/mm/dd" name="task_date" class="ml-1" value="${task.date}"/>
              <input type="time" placeholder="hh:mm" style="margin-left:5px" name="task_time" value="${task.time}"/>
            </div>
            <div class="form_group">
              <h4><i class="far fa-file"></i>File</h4>
              <div class="d_flex">
                <div class="file_info ml-1 ${task.file? '':'d_none'}">
                  <p class="name">${task.file? task.file.name:''}</p>
                  <p class="upload">${task.file? task.fileTime:''}</p>
                </div>
                <label for="task_file${task.id}" class="file_btn ml-1">
                  <input id="task_file${task.id}" type="file" name="task_file" hidden="hidden"/>
                </label>
              </div>
            </div>
            <div class="form_group">
              <h4><i class="far fa-comment-dots"></i>Comment</h4>
              <textarea name="task_comment" rows="6" placeholder="Type Your Memo Here..." class="ml-1">${task.comment}</textarea>
            </div>
            <div class="button_group">
              <button class="btn_cancel">X Cancel</button>
              <button id="js_saveTask${task.id}" class="btn_primary">+ Save</button>
            </div>
          </div>
        </div>`;
    });
    $('.task_lists').html(template).hide();
    $('.task_left_info').html(leftTaskCount+' tasks left');
    //check mode to display
    $('header .nav_list').filter('.active').click();
    $('.task_lists').show();
  }

  renderTask();
});