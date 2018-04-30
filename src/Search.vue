<template lang="pug">
  ais-index(:search-store="searchStore")
    header
      .container
        nav.level
          .level-left
            .level-item
              img(src="./logo.png")
          .level-item.has-text-centered
              router-link(to="/foo") Go to Foo
              ais-input(placeholder="Search for videos...")
    section.section
          .container
            .columns
              .column.is-one-quarter
                .columns
                  .column
                    h1.title Channel
                    ais-refinement-list.is-uppercase(:class-names="{'ais-refinement-list__count': 'tag'}" attribute-name="channelTitle")
                .columns
                  .column
                    h1.title Tags
                    #tag.is-uppercase
                .columns
                  .column
                    h1.title Speaker
                    #speaker.is-uppercase
              .column
                .columns
                  .column
                    .has-text-right
                      #sort.select
                  ais-results#videos.columns.is-multiline
                    template(slot-scope="{ result }")
                      .column.is-6.is-4-widescreen
                        .card
                            .card-image
                              .image.is-16by9(:style="'background-image:url(https://img.youtube.com/vi/' + result.objectID + '/maxresdefault.jpg)'")
                                .is-overlay
                                  p.ttl.is-uppercase.is-size-7 {{result.title}}
                            .card-content
                                nav.level.is-mobile
                                  .level-item.has-text-centered
                                    div
                                      p.heading: i.far.fa-smile
                                      p.title.is-size-7 {{result.likes}}
                                  .level-item.has-text-centered
                                    div
                                      p.heading Views
                                      p.title.is-size-7 {{result.views}}
                                  .level-item.has-text-centered
                                    div                
                                      p.heading Duration
                                      p.title.is-size-7 {{result.duration}}
                                  .level-item.has-text-centered
                                    div                
                                      p.heading Date
                                      p.title.is-size-7 {{result.publishedAt}}
                                span.tag.is-uppercase Java 
                                span.tag.is-uppercase {{result.channelTitle}} 
                                span.tag.is-uppercase.is-success Top 100
                                nav.actions.is-pulled-right
                                    i.fas.fa-star
                                    i.fas.fa-share-alt
    section.section
      .container
        .columns
          .column
            nav.paging(role="navigation" aria-label="pagination")
             ais-pagination.pagination(:class-names="{'ais-pagination': 'pagination-list', 'ais-pagination__item': 'page', 'ais-pagination__link': 'pagination-link', 'ais-pagination__item--previous': 'is-hidden', 'ais-pagination__item--next': 'is-hidden', 'ais-pagination__item--active': 'is-current'}")
</template>
<style lang="scss">
header {
  background-color: #343d46;
  padding: 30px;
  color: #ec0047;

  input {
    outline: none;
    color: white;
    font-size: 15px;
    font-weight: 100;
    background-color: #343d46;
    padding: 16px 26px 16px 52px;
    border: 1px solid #6498cf;
    border-radius: 3px;
  }
}

.paging  {
  .pagination-list {
    justify-content: center;
  }

  .is-current a {
    background-color: #343d46;
    color: white;
  } 
}

#videos {
  .card {
    
    transition: 0.4s ease;

    nav.actions {
      transition: 0.4s ease;
      opacity: 0;
    }
  }

  .card {

    div.image {

      background-size: cover;
      position: relative;

        div.is-overlay {
          transition: 0.4s ease;
          background: url('./overlay.png');
        }

    .ttl {
        position: absolute;
        bottom: 20px;
        width: 90%;
        left: 10%;
        background-color: #4988cb;
        opacity: 0.9;
        color: white;
        padding: 5px 0 5px 20px;
        /*font-size: 0.8rem;*/
        padding-right: 20px;
    }       
      } 

  }

  .card:not(.verified) {
  }

  .card em {
    color: #ec0047;
  }

  .card:hover {

    box-shadow: 0 2px 3px rgba(10,10,10,.20), 0 0 0 1px rgba(10,10,10,.20);

    cursor: pointer;

    div.is-overlay {
      opacity: 0;
    }

    nav.actions {
      opacity: 1;
    }
  } 
}
</style>
<script>
import { createFromAlgoliaCredentials } from 'vue-instantsearch';

const searchStore = createFromAlgoliaCredentials(
  'DR90AOGGE9',
  'c2655fa0f331ebf28c89f16ec8268565'
);
searchStore.indexName = 'videos';

export default {
  props: {
    queryParameters: {
      type: Object,
      default: '',
    },
  },
  
  created() {
    this.searchStore.queryParameters = this.queryParameters;
  },
  data() {
    return {
      searchStore,
    };
  },
  watch: {
    'searchStore.queryParameters'(parameters) {
      const query = parameters;
      delete query.index;

      this.$router.push({
        name: 'search',
        query,
      });
    },
  },
};
</script>
