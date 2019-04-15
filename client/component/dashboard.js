Vue.component("dashboard", {
  data() {
    return {
      dashboard: {
        loader: false,
        profile: false
      },
      author: {
        articles: null
      },
      search: null
    };
  },
  template: `
  <div class="container">
    <div class="container" v-if="dashboard.loader">
      <div class="row">
        <div class="col-sm-4 offset-5">
          <img src="./image/loader.gif" alt="">
        </div>
      </div>
    </div>
    <div class="container" v-if="dashboard.profile">
      <div class="d-flex justify-content-center flex-row">
        <div class="d-flex justify-content-center p-2">
          <div class="p-2"> <img class="col-md-4 col-sm-4 col-xs-4" :src="author.articles.picture" alt="">
                <slot > </slot>
          </div>
          <div class="p-2">
            <h3> {{ author.articles.name}}</h3> <small class="form-text text-muted">{{ author.articles.age }} years old</small>
          </div>
        </div>
      </div>
      <div class="d-flex flex-wrap mx-2 p-4">
      <form @submit.prevent="findThis">
        <input class="form-control" type="text" placeholder="Search" aria-label="Search" @keyup.enter="check" v-model="search">
      </form>
      </div>
      <div class="container p-2" id="articles">
        <div class="d-flex flex-wrap mx-2 p-2">
          <div class="p-2 mx-2 p-2" v-for="(article, i) in author.articles.articles" :key="i">
            <h2> {{article.title}}</h2>
            <p>   {{ article.content.split(" ").slice(0, 70).join(" ").replace(/(<([^>]+)>)/ig, '')}}..........</p>
            <div class="d-flex">
              <div class="mr-auto p-2"> <button type="button" class="btn btn-info" @click="$emit('readmore', article)"> read more</button></div>
                  <div class="p-2"> <button type="button" class="btn btn-primary" @click="$emit('editable', article)"> edit </button></div>
                  <div class="p-2"> <button type="button" class="btn btn-danger" @click="$emit('delete-button', article._id)"> delete </button></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  methods: {
    async goProfiles() {
      this.dashboard.loader = true;
      try {
        const id = localStorage.getItem("userId");
        const { data } = await goAxios.get("/user/myarticle/" + id);
        this.dashboard.loader = false;
        this.author.articles = data;
        this.dashboard.profile = true;
      } catch (err) {
        this.dashboard.loader = false;
        alertify.error(err.response.data.error);
      }
    },
    async data() {
      try {
        const id = localStorage.getItem("userId");
        const { data } = await goAxios.get("/user/myarticle/" + id);
        this.author.articles = data;
        this.dashboard.profile = true;
      } catch (err) {
        alertify.error(err.response.data.error);
      }
    },
    check() {
      console.log(this.search, "check enter");
      this.dashboard.profile = false;
      this.dashboard.loader = true;
      this.author.articles = [];
    },
    async findThis() {
      this.author.articles = [];
      this.dashboard.loader = true;
      try {
        const { data } = await goAxios.get(
          "/user/findarticle/" + localStorage.getItem("userId"),
          {
            search: this.search
          }
        );
        console.log(data);
        this.dashboard.loader = false;
        this.author.articles = data;
        this.dashboard.profile = true;
      } catch (e) {
        this.dashboard.loader = false;
        console.log(e, "ini error");
        alertify.error(e.response.data.error);
      }
    }
  },
  created() {
    this.goProfiles();
  },
  updated() {
    this.data();
  }
});
