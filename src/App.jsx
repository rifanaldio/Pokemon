import Search from './components/search';
import Navbar from './components/navbar';
import Footer from './components/footer';
import Grid from './layout/grid';
import Container from './layout/container';
import React from 'react';
import './App.css';

export default class App extends React.Component {

  //this state
  constructor(props) {
    super(props);
    this.state = {
      pokemons: [],
      total: 0,
      notFound: false,
      search: [],
      searching: false,
      loading: true,
      text: ``
    }
    this.handleSearch = this.handleSearch.bind(this);
    this.showPokemons = this.showPokemons.bind(this);
    this.nextPokemon = this.nextPokemon.bind(this);
  }

  //handle for search 
  async handleSearch(textSearch) {
    // if search is empty
    if (!textSearch) {
      this.setState({
        search: [],
        notFound: false,
        searching: false,
        loading: false
      })
      return;
    } else {
      this.setState(prev => ({
        search: [],
        searching: prev,
        notFound: false,
        text: textSearch,
        loading: prev
      }))
    }
    //fetching , To create a type, not provided query for size ( example => size = 20) 
    //so i show all data and make "show more" button disappear
    const api = await fetch(`https://pokeapi.co/api/v2/type/${textSearch.toLowerCase()}`);
    const data = await api.json().catch(() => undefined);
    console.log("🚀 ~ file: App.jsx:49 ~ App ~ handleSearch ~ api:", api)
    console.log("🚀 ~ file: App.jsx:49 ~ App ~ handleSearch ~ data:", data)

    //check data for validate
    if (data != undefined) {
      const promises = data.pokemon.map(async pokemon => {
        const result = await fetch(pokemon?.pokemon.url);
        const res = await result.json();
        return res;
      });
      const results = await Promise.all(promises);
      console.log(results);

      if (!results) {
        this.setState({
          notFound: true,
        })
      } else {
        this.setState(prev => ({
          search: [...prev.search, ...results],
          total: prev.total + results.length,
          loading: false
        }))
      }
      this.setState({
        searching: false,
      })
    } else {
      this.setState({
        loading: false,
        notFound: true,

      })
    }
  }

  //if search is not used then fetch api for all pokemons
  async showPokemons(limit = 20, offset = 0) {
    const api = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
    const data = await api.json();
    const promises = await data.results.map(async pokemon => {
      const result = await fetch(pokemon.url);
      const res = await result.json();
      return res;
    });

    const results = await Promise.all(promises);

    this.setState(prev => ({
      pokemons: [...prev.pokemons, ...results],
      notFound: false,
      total: prev.total + results.length,
      loading: false,
    }));
  }

  nextPokemon() {
    this.showPokemons(20, this.state.total);
  }

  componentDidMount() {
    if (!this.state.searching) {
      this.showPokemons();
    }
  };


  l
  render() {
    const poke = this.state.search.length > 0 ? this.state.search : this.state.pokemons;
    return (
      <>
        <Container>
          <Navbar />
          <Search onHandleSearch={this.handleSearch} />
          {
            this.state.loading ? <div className='loader' /> :
              this.state.notFound ? <div>'Pokemon not found'</div> :
                <Grid pokemons={poke} next={this.nextPokemon} loading={this.state.loading} search={this.state.search.length != 0} />
            // this.state.loading ? (
            //   <div className='loader' />
            // ) : (this.state.notFound ? (
            //   <div>'Pokemon not found'</div>
            // ) : (
            //   <Grid pokemons={poke} next={this.nextPokemon} search={this.state.search.length != 0} />
            // ))
          }
        </Container>
        <Footer />
      </>
    );
  }
}

