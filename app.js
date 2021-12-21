const app = Vue.createApp({
    data(){//inicializo las propiedades de la instancia app
        return {
            miembros: [],
            partidos: ["D","R","ID"],
            estado:"",
            estadisticas:{
                democratas:[],
                republicanos:[],
                independientes:[],
                menosComprometidos:[],
                masComprometidos:[],
                menosLeales:[],
                masLeales:[]
            }
        }
    },
    created(){
        let house = document.getElementById("house");
        let chamber = house ? "house" : "senate";
        let endpoint = `https://api.propublica.org/congress/v1/113/${chamber}/members.json`;
        let init = {
            headers:{
                "X-API-key": "4k3O0fiojHbeTF4kqu2R7dfC17NsWOO7cTHNtnfZ"
            }
        }
        fetch(endpoint, init)
        .then(response => response.json())
        .then(json => {
            this.miembros=json.results[0].members;
            this.poblarPoliticos(this.miembros);
            this.estadisticas.menosComprometidos = this.menosComprometidos();
            this.estadisticas.masComprometidos = this.masComprometidos();
            this.estadisticas.menosLeales = this.menosLeales();
            this.estadisticas.masLeales = this.masLeales();
        })
        .catch(err => console.log(err.message))
    },
    methods:{
        poblarPoliticos(array){//inserto politicos en la propiedad de la instancia app
            this.estadisticas.democratas = array.filter(miembro => miembro.party === "D");
            this.estadisticas.republicanos = array.filter(miembro => miembro.party === "R");
            this.estadisticas.independientes = array.filter(miembro => miembro.party === "ID");
        },
        calcularCantidad(array){
            return array.length;
        },
        calcularPorcentajeVotesWParty(array){//devuelvo su porcentaje en string con dos decimales
            let totalVotesWParty = array.reduce((acumulador, miembro) => acumulador = acumulador + miembro.votes_with_party_pct, 0);
            let cantidad = this.calcularCantidad(array);
            return cantidad === 0 ? 0 : (totalVotesWParty/cantidad).toFixed(2);
        },
        calcularPorcentajesTotales(){
            return (this.miembros.reduce((acumulador, miembro) => acumulador = acumulador + miembro.votes_with_party_pct, 0) / this.calcularCantidad(this.miembros)).toFixed(2);
        },
        menosComprometidos(){//ordeno descendente y trunco en su 10% inicial
            return this.miembros.sort((a,b) => a.missed_votes_pct<b.missed_votes_pct ? 1 : -1 ).slice(0, this.miembros.length*0.1)
        },
        masComprometidos(){//ordeno ascendente y trunco en su 10% inicial
            return this.miembros.sort((a,b) => a.missed_votes_pct>b.missed_votes_pct ? 1 : -1 ).slice(0, this.miembros.length*0.1)
        },
        menosLeales(){//ordeno ascendente y trunco en su 10% inicial
            return this.miembros.sort((a,b) => a.votes_with_party_pct>b.votes_with_party_pct ? 1 : -1 ).slice(0, this.miembros.length*0.1)
        },
        masLeales(){//ordeno descendente y trunco en su 10% inicial
            return this.miembros.sort((a,b) => a.votes_with_party_pct<b.votes_with_party_pct ? 1 : -1 ).slice(0, this.miembros.length*0.1)
        }
    },
    computed:{
        miembrosFiltrados(){
            return this.miembros.filter(miembro => (miembro.state === this.estado || this.estado === "") && this.partidos.includes(miembro.party))
        }
    }
})
app.mount("#app");