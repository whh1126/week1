$.ajax({
    url: "api/list",
    dataType: "json",
    success: function(data) {
        var html = ``;
        //便利数据 添加到结构里
        $.each(data.data, function(index, item) {

            html += `
            <h2>${item.title}</h2>
            <p>${item.cont}</p>
            <span>${item.time}</span>
           `
            $('#last').appendTo(html);
        })
    }
})