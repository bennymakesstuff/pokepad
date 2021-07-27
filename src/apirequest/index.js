import Vue from 'vue';
import store from '@/store'
import { request, gql } from 'graphql-request'

const server = 'https://beta.pokeapi.co/graphql/v1beta';

// The API Vue Plugin Object
export default {

   // This install function gets triggered when Vue.use() is invoked passing in the plugin.
   install(Vue) {

    Vue.prototype.$API = {

      get: async function(){
        const response = await fetch(server, {
          method: 'GET', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, *cors, same-origin
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, *same-origin, omit
          headers: {
            'Content-Type': 'application/json',
          },
          redirect: 'follow', // manual, *follow, error
          referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        //  body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        let result = await response.json();
        console.log("Response Result");
        console.log(result[0]);
        if(result[0]==false&&result[1]=='token'){
          store.dispatch('logout');
          return false;
        }
        console.log("Response Result");
        return result; // parses JSON response into native JavaScript objects
      },


      post: async function(data = {}){
        const response = await fetch(server, {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, *cors, same-origin
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, *same-origin, omit
          headers: {
            'Content-Type': 'application/json',
          },
          redirect: 'follow', // manual, *follow, error
          referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(data) // body data type must match "Content-Type" header
        });

        let result = await response.json();
        console.log("Response Result");
        console.log(result[0]);
        if(result[0]==false&&result[1]=='token'){
          store.dispatch('logout');
          return false;
        }
        console.log("Response Result");
        return result; // parses JSON response into native JavaScript objects
      },

      pokeapi: async function(query, variables, operationName){
        const response = await fetch(server, {
          method: "POST",
          body: JSON.stringify({
            query: query,
            variables: variables,
            operationName: operationName
          })
        });

        let result = await response.json();
        console.log(result);

        return result[Object.keys(result)[0]]; // parses JSON response into native JavaScript objects
      },


    }
  }
};
