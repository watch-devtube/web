// page('/', index)
page('/video/:video_urn', function(ctx, next) {alert(ctx.params.video_url)})
page()

const search = instantsearch({
  appId: 'DR90AOGGE9',
  apiKey: 'c2655fa0f331ebf28c89f16ec8268565',
  indexName: 'videos',
  searchParameters: {
    hitsPerPage: 20
  },
});

search.addWidget(
  instantsearch.widgets.hits({
    container: document.querySelector('#videos'),
	cssClasses: {
	  root: ['columns', 'is-multiline'],
	  item: ['column', 'is-6', 'is-4-widescreen']
	},    
    templates: {
      item:
        function(hit) { return nunjucks.render('hit.html', hit) }
    },
  })

);

search.addWidget(
  instantsearch.widgets.searchBox({
    container: document.querySelector('#search'),
    placeholder: 'Search for videos...'
  })
);

search.addWidget(
  instantsearch.widgets.refinementList({
    container: document.querySelector('#channel'),
    attributeName: 'channelTitle',
    cssClasses: {
      count: 'tag'
    }
  })
);

search.addWidget(
  instantsearch.widgets.refinementList({
    container: document.querySelector('#speaker'),
    attributeName: 'speaker',
    cssClasses: {
      count: 'tag'
    }
  })
);

search.addWidget(
  instantsearch.widgets.refinementList({
    container: document.querySelector('#tag'),
    attributeName: 'tags',
    cssClasses: {
      count: 'tag'
    }
  })
);

search.addWidget(
  instantsearch.widgets.sortBySelector({
    container: document.querySelector('#sort'),
    indices: [ 
      { name: 'videos_date_desc', label: 'Newest' },
      { name: 'videos_rating_desc', label: 'Highly rated' },
      { name: 'videos', label: 'Most relevant' },
      { name: 'videos_views_desc', label: 'Most viewed' }
    ],
    cssClasses: {

    }
  })
);


search.addWidget(
  instantsearch.widgets.pagination({
    container: document.querySelector('.paging'),
    showFirstLast: false,
    cssClasses: {
    	root: 'pagination-list',
    	link: 'pagination-link',
      previous: 'is-hidden',
      next: 'is-hidden',
    	active: 'is-current'
    }
  })
);

search.start();
