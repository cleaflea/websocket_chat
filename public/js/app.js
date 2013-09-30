// Generated by CoffeeScript 1.6.3
(function() {
  jQuery(function() {
    var dialog, message, send_msg, ws;
    $.fn.editable.defaults.mode = 'inline';
    $.extend($.emojiarea.defaults, {
      button: '#addemoji'
    });
    $('textarea').emojiarea();
    $('#username').editable({
      type: 'text',
      pk: 1,
      url: '/username',
      title: 'Enter username'
    });
    $('#username').on('save', function(e, params) {
      return location.reload();
    });
    ws = new WebSocket("ws://0.0.0.0:1438");
    ws.onmessage = function(evt) {
      return $('#chat').append(evt.data).scrollTop(900000);
    };
    ws.onclose = function() {
      dialog('连接已断开，请刷新页面');
      return ws.send("Leaves the chat");
    };
    ws.onopen = function() {
      var editor;
      editor = $(".emoji-wysiwyg-editor:last");
      editor.empty().attr('contenteditable', true);
      return send_msg("Join the chat");
    };
    message = function(title, content) {
      var time;
      time = moment().format("YYYY-MM-DD HH:mm:ss");
      return "<dl><dt><span class='badge badge-success'>" + title + " " + time + "</span></dt><dd>" + content + "</dd></dl>";
    };
    $("#send").click(function(e) {
      var editor;
      editor = $(".emoji-wysiwyg-editor:last");
      send_msg(editor.html());
      editor.empty();
      return false;
    });
    send_msg = function(text) {
      if (ws.readyState !== WebSocket.OPEN) {
        return dialog('连接已断开，请刷新页面');
      } else {
        if (text.length > 0) {
          $('#chat').append(message($('#username').text(), text));
          ws.send(text);
          return $('#chat').scrollTop(900000);
        }
      }
    };
    $(document).live('keydown', function(e) {
      if (e.ctrlKey && e.keyCode === 13) {
        return $('#send').trigger('click');
      }
    });
    $("#clear").click(function() {
      return $('#chat dl').remove();
    });
    $(document).on('hidden', '#modal', function() {
      return $(this).remove();
    });
    dialog = function(msg) {
      var html;
      html = "<div id='modal' class='modal hide fade'>    <div class='modal-header'> <button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>    <h3>WebSocketChat</h3>    </div>    <div class='modal-body'>      <p>" + msg + "</p>    </div>    <div class='modal-footer'>      <a href='#' aria-hidden='true' data-dismiss='modal' class='btn'>关闭</a>      <a href='#' class='btn btn-primary' onclick='location.reload()'>确认</a>    </div>    </div>";
      $('body').append(html);
      return $('#modal').modal('show');
    };
    return $('#fileselect').on('change', function() {
      var fd, xhr;
      if ($('#fileselect').val()) {
        xhr = new XMLHttpRequest();
        fd = new FormData(document.getElementById('form'));
        xhr.onload = function(evt) {
          var data, elem, _ref, _ref1;
          data = JSON.parse(xhr.response);
          if ((_ref = data.type) === 'jpg' || _ref === 'jpeg' || _ref === 'png' || _ref === 'gif') {
            elem = "<img src=" + data.url + " />";
          } else if ((_ref1 = data.type) === 'mp3' || _ref1 === 'aac' || _ref1 === 'ogg') {
            elem = "<audio controls src=" + data.url + " />";
          } else {
            elem = "<a href=" + data.url + ">" + data.name + "</a>";
          }
          return $('.emoji-wysiwyg-editor').append(elem);
        };
        xhr.open("POST", '/upload');
        return xhr.send(fd);
      }
    });
  });

}).call(this);
