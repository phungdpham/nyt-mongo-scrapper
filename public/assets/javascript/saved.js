$(document).ready(function() {
    var articleContainer = $('.article-container');

    $(document).on('click', '.btn.delete', handleArticleDelete);
    $(document).on('click', '.btn.notes', handleArticleNotes);
    $(document).on('click', '.btn.save', handleNoteSave);
    $(document).on('click', '.btn.note-delete', handleNoteDelete);
    $('.clear').on('click', handleArticleClear);

    function initPage() {
        $.get('/api/headlines?saved=true').then(function(data) {
            articleContainer.empty();
            if (data & data.length) {
                renderArticles(data);
            } else {
                renderEmpty();
            }
        });
    }

    function renderArticles(articles) {
        var articleCards = [];
        for (var i = 0; i < articles.length; i++) {
            articleCards.push(createCard(articles[i]));
        }
        articleContainer.append(articleCards);
    }

    function createCard(article) {
        var card = $("<div class='card'>");
        var cardHeader = $("<div class='card-header'>").append(
            $('<h3>').append(
                $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
                    .attr('href', article.url)
                    .text(article.headline),
                $("<a class='btn btn-danger delete'>Delete From Saved</a>"),
                $("<a class='btn btn-info notes'>Article Note</a>")
            )
        );

        var cardBody = $("<div class='card-body'>").text(article.summary);

        card.append(cardHeader, cardBody);

        card.data('_id', article_id);
        return card;
    }

    function renderEmpty() {
        var emptyAlert = $(
            [
                "<div class='alert alert-warning text-center'>",
                "<h4>Uh Oh. Look like we don't have any saved articles.</h4>",
                "</div>",
                "<div> class='card'>",
                "<div class='card-header text-center'>",
                "<h3>Would you like to browse available articles?</h3>",
                "</div>",
                "<div class='card-body text-center'>",
                "<h4><a href='/'>Browse Articles</a></h4>",
                "</div>",
                "</div>"
            ].join("")
        );
        //Appending this data to the page
        article.append(emptyAlert);
    }

    function renderNotesList(data) {
        var notesToRender = [];
        var currentNote;
        if (!data.notes.length) {
            currentNote = $("<li class='list-group-item'>No notes for this articles yet.</li>");
            notesToRender.push(currentNote);
        } else {
            for (var i = 0; i < data.notes.length; i++) {
                currentNote = $("<li class='list-group-item note'>")
                    .text(data.notes[i].noteText)
                    .append($("<button class='btn btn-danger note-delete'>x</button>"));
                currentNote.children('button').data('_id', data.notes[i]._id);
                notesToRender.push(currentNote);
            }
        }
        $('.note-container').append(notesToRender);
    }

    function handleArticleDelete() {
        //grab the id of the article to delete from the card element button sits inside
        var articleToDelete = $(this)
            .parents('.card')
            .data();

        //remov card from page
        $(this)
            .parents('.card')
            .remove();
        //use a delete method
        $.ajax({
            method: 'DELETE',
            url: '/api/headlines/' + articleToDelete._id
        }).then(function(data) {
            //run initPage again which will re-render list of saved articles
            if (data.ok) {
                initPage();
            }
        });
    }
    function handleArticleNotes(event) {
        //grab the id of the article to get notes for the card element
        var currentArticle = $(this)
            .parents('.card')
            .data();
        //grab any notes with this headline/article id
        $.get('/api/notes/' + currentArticle._id).then(function(data) {
            var modalText = $("<div class='container-fluid text-content'>").append(
                $('<h4>').text('Notes for Article: ' + currentArticle._id),
                $('<hr>'),
                $("<ul class='list-group note-container'>"),
                $("<textarea placeholder='New Note' rows='4' cols = 60>"),
                $("<button class='btn-btn-success save'>Save Note</Button")
            );
            //Adding the formatted html to the note modal
            bootbox.dialog({
                message: modalText,
                closeButton: true
            });
            var noteData = {
                _id: currentArticles._id,
                notes: data || []
            };
            //Adding a new note
            $('.btn.save').data('article', noteData);
            renderNotesList(noteData);
        });
    }

    function handleNoteSave() {
        var noteData;
        var newNote = $('.bootbox-body textarea')
            .val()
            .trim();

        if (newNote) {
            noteData = { _headlineId: $(this).data('article')._id, noteText: newNote };
            $.post('/api/notes', noteData).then(function() {
                //whensaving is complete, close the modal
                bootbox.hideAll();
            });
        }
    }

    function handleNoteDelete() {
        var noteToDelete = $(this).data('_id');
        $.ajax({
            url: '/api/notes/' + noteToDelete,
            method: 'DELETE'
        }).then(function() {
            //when done, hide the modal
            bootbox.hideAll();
        });
    }

    function handleArticleClear() {
        $.get('api/clear')
            .then(function() {
                articleContainer.empty();
                initPage();
            });
    }
});