Vue.component("home-page", {
  props: {
    articles: Array,
    loader: Boolean
  },
  template: `
  <div class="container" v-if="loader">
    <div class="row">
      <div class="col-sm-4 offset-5">
        <img src="./image/loader.gif" alt="">
      </div>
    </div>
  </div>
  <div class="container" id="articles" v-else>
    <div class="row align-items-center justify-content-center" v-for="(article, i) in articles" :key="i">
      <div class="pull-left">
        <img :src="article.author.picture" width='200px' alt="">
      </div>
      <div class="col-sm-8 col-md-8 col-xs-16">
        <h2> {{article.title}}</h2>
        <p> {{ article.content.split(" ").slice(0, 70).join(" ").replace(/(<([^>]+)>)/ig, '')}}........</p>
        <div class="d-flex p-10">
          <div class="mr-auto p-2"> <button type="butto" class="btn btn-info" @click="$emit('read-more', article)"> read more</button></div>
          <div class="p-2">
            <p class="small" v-if="!article.author"> anonymous author</p>
            <p class="small" v-else> {{ article.author.name }}, {{ article.author.age }} years old <br /> {{ new Date(article.created_at).toString().split(" ").slice(0, 4).join(" ") }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
});
