





  data = {
    TournamentInfo: {
      Name: "#023 STRONG PADEL STORE OPEN",
      GamesTotal: "70",
      GamesDone: "35",
      LastUpdate: "23:34",
      Clubs: {
        MainClub: {
          Name: "Braga Padel Social Cup",
          Logo: "https://www.padelteams.pt/data/img/clogo_1771_pdieuezx1679485560.png"
        },
        OtherClubs: []
      },
      ScheduleShowPerLine: "3",
      Schedule: [
        {
          CourtName: "Campo 1",
          Games: [
            {
              StartTime: "09:00",
              TeamHome: {
                Player1: "Jogador A",
                Player2: "Jogador B"
              },
              TeamAway: {
                Player1: "Jogador C",
                Player2: "Jogador D"
              }
            },
            {
              StartTime: "10:30",
              TeamHome: {
                Player1: "Jogador E",
                Player2: "Jogador F"
              },
              TeamAway: {
                Player1: "Jogador G",
                Player2: "Jogador H"
              }
            },
            {
              StartTime: "11:30",
              TeamHome: {
                Player1: "Jogador HG",
                Player2: "Jogador A"
              },
              TeamAway: {
                Player1: "Jogador Z",
                Player2: "Jogador T"
              }
            }
          ]
        },
        {
          CourtName: "Campo 2",
          Games: [
            {
              StartTime: "09:00",
              TeamHome: {
                Player1: "Jogador I",
                Player2: "Jogador J"
              },
              TeamAway: {
                Player1: "Jogador K",
                Player2: "Jogador L"
              }
            },
            {
              StartTime: "10:30",
              TeamHome: {
                Player1: "Jogador M",
                Player2: "Jogador N"
              },
              TeamAway: {
                Player1: "Jogador O",
                Player2: "Jogador P"
              }
            }
          ]
        },
        {
          CourtName: "Campo 3",
          Games: [
            {
              StartTime: "09:00",
              TeamHome: {
                Player1: "Jogador I",
                Player2: "Jogador J"
              },
              TeamAway: {
                Player1: "Jogador K",
                Player2: "Jogador L"
              }
            },
            {
              StartTime: "10:30",
              TeamHome: {
                Player1: "Jogador M",
                Player2: "Jogador N"
              },
              TeamAway: {
                Player1: "Jogador O",
                Player2: "Jogador P"
              }
            }
          ]
        },
        {
          CourtName: "Campo 4",
          Games: [
            {
              StartTime: "09:00",
              TeamHome: {
                Player1: "Jogador I",
                Player2: "Jogador J"
              },
              TeamAway: {
                Player1: "Jogador K",
                Player2: "Jogador L"
              }
            },
            {
              StartTime: "10:30",
              TeamHome: {
                Player1: "Jogador M",
                Player2: "Jogador N"
              },
              TeamAway: {
                Player1: "Jogador O",
                Player2: "Jogador P"
              }
            }
          ]
        },
        {
          CourtName: "Campo 5",
          Games: [
            {
              StartTime: "09:00",
              TeamHome: {
                Player1: "Jogador I",
                Player2: "Jogador J"
              },
              TeamAway: {
                Player1: "Jogador K",
                Player2: "Jogador L"
              }
            },
            {
              StartTime: "10:30",
              TeamHome: {
                Player1: "Jogador M",
                Player2: "Jogador N"
              },
              TeamAway: {
                Player1: "Jogador O",
                Player2: "Jogador P"
              }
            },
            {
              StartTime: "11:30",
              TeamHome: {
                Player1: "Jogador M",
                Player2: "Jogador N"
              },
              TeamAway: {
                Player1: "Jogador O",
                Player2: "Jogador P"
              }
            }
          ]
        },
        {
          CourtName: "Campo 6",
          Games: [
            {
              StartTime: "09:00",
              TeamHome: {
                Player1: "Jogador I",
                Player2: "Jogador J"
              },
              TeamAway: {
                Player1: "Jogador K",
                Player2: "Jogador L"
              }
            },
            {
              StartTime: "10:30",
              TeamHome: {
                Player1: "Jogador M",
                Player2: "Jogador N"
              },
              TeamAway: {
                Player1: "Jogador O",
                Player2: "Jogador P"
              }
            }
          ]
        }
      ],
      Classifications: [
            {
                Category:"M4",
                Phase:"Groups",
                Group : "A"
        
          }
        ]
      }
    }
  };

















  
  const { createApp } = Vue
  createApp({
    data() {
      return {
        tournamentInfo: {},
        timestamp: ''
      }
    },
    mounted() {
      console.log('Mounted!');

          this.tournamentInfo = data.TournamentInfo;
    },
    created() {
      setInterval(this.GetNow, 1000);
    },
    computed(){

    },

    methods: {
      GetNow: function() {
          const today = new Date();
          const time = today.getHours() + ":" + today.getMinutes();
          this.timestamp = time;
      }
  }

  }).mount('#app')

