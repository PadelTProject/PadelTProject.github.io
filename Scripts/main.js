



  
  const { createApp } = Vue
  createApp(
    {

    
    data() {
      return {
        tournamentInfo: {
          clubs: {
            MainClub: {
              Logo: '',
              Name: ''
            },
            otherClubs: []
          },
          dataToShow: {},
          timestamp: '',
          schedule: [],
        },
        currentScreen: 0, 
        tournamentCode: '',
        apiDataTimingCounter: 999

      }
    },
    mounted() {
         this.RunLogic();
          
    },
    created() {
      this.GetNow(); // Initialize the timestamp
      let uri = window.location.search.substring(1); 
      let params = new URLSearchParams(uri);
      this.tournamentCode = params.get("code");
      console.log()
      
    },

    methods: {

      GetLogoUrl(logoPath) {
        const domain = 'https://www.padelteams.pt';
        const fullUrl = domain + logoPath;
        return fullUrl;
      },

      GetNow: function() {
        const today = new Date();
        const hours = today.getHours();
        let minutes = today.getMinutes();
      
        if (minutes < 10) {
          minutes = "0" + minutes; // add a leading zero
        }
      
        const time = hours + ":" + minutes;
        this.timestamp = time;
      },
      
      GetDataFromAPI: function()
      {
        if(this.apiDataTimingCounter > 6)
        {
          this.apiDataTimingCounter = 0;

          return axios({ url: 'https://padelteams.pt/api/v1/tournament-info?code=' + this.tournamentCode, method: 'get' })
            .then(response => {
              if(response.data.success == "1")
              {            
                this.rawdata = response.data.data.TournamentInfo;
              }
              else
              {
                console.log('An error occurred while fetching data.');
              }
                
              this.PrepareTournamentData();
              this.SanitizeSchedule();
              this.PrepareGamesData();  
            })
            .catch(error => {
              console.log('An error occurred while fetching data.');
            });
        }
        else
        {
          this.PrepareTournamentData();
          this.SanitizeSchedule();

          this.PrepareGamesData();  
        }
        
      },

      SanitizeSchedule: function()
      {
        this.tournamentInfo.schedule = [];

        this.rawdata.Courts.forEach((item, index) => {

          let court = { Id: item.id, Name: item.name, Games: this.FindGamesByCourt(item.id) };
          if(court.Games.length > 0)
            this.tournamentInfo.schedule.push(court);
        })

        //remove empties
        this.tournamentInfo.schedule
        


      },

      FindGamesByCourt: function(courtId)
      {
        let listOfGames = [];

        const filter = game => 
            game.CourtId == courtId && !game.Results;


        this.rawdata.Classifications.forEach((cat) => {
            cat.Phases.forEach((phase) => {
              phase.Groups.forEach((group) => {
                let gamesNotDone = group.Results.filter(filter);
                if(gamesNotDone.length > 0 )
                  listOfGames = listOfGames.concat(gamesNotDone)
    
              })
  
            })

        })

          return listOfGames;
      },

      PrepareTournamentData: function()
      {
        if(this.rawdata)
        {
          this.tournamentInfo.name = this.rawdata.Name;
          this.tournamentInfo.gamesTotal = this.rawdata.GamesTotal;
          this.tournamentInfo.gamesDone = this.rawdata.GamesDone;
          this.tournamentInfo.lastUpdate = this.rawdata.LastUpdate;
          this.tournamentInfo.clubs = this.rawdata.Clubs;
        }    
      },

      PrepareGamesData: function()
      {
        this.currentScreen ++;     
        if(this.rawdata)
        {
          var numberOfSchedules = this.NumberOfScheduleScreens();
          if(this.currentScreen <= numberOfSchedules)
          {
              this.tournamentInfo.dataToShow = this.GenerateScheduleScreen();
              console.log("hello");

          }
          else
          {
            var numberOfClassifications = this.NumberOfClassificationsScreens();
            if(this.currentScreen <= (numberOfSchedules+numberOfClassifications))
            {
               this.tournamentInfo.dataToShow = this.GenerateClassificationsScreen(this.currentScreen-numberOfSchedules);
               console.log(this.tournamentInfo.dataToShow);
            }
            else
            {
              this.currentScreen = 0;
              this.PrepareGamesData();
            }

          }

        }    
      },
      NumberOfScheduleScreens: function()
      {
        if(this.tournamentInfo.schedule)
          return Math.ceil(this.tournamentInfo.schedule.length / (this.rawdata.ScheduleShowPerLine * 2));
        else
          return 0;
      },
      NumberOfClassificationsScreens: function()
      {
        if(this.rawdata.Classifications)
        {
          var total = 0;
          (this.rawdata.Classifications).forEach(element => {
            
            total += this.GetCategoryScreens(element);

          });
          return total;

        }
        else
          return 0;
      },

      GenerateScheduleScreen : function()
      {

        var typeOfScreen = "schedule";
        if(this.tournamentInfo.schedule.length <= this.rawdata.ScheduleShowPerLine)
        {
          return  {
            type: typeOfScreen,
            scheduleData: this.tournamentInfo.schedule,
            scheduleShowFullScreen: true,
            scheduleShowPerLine: this.rawdata.ScheduleShowPerLine
          };

        }
        else
        {
          return {
            type: typeOfScreen,
            scheduleData: this.tournamentInfo.schedule,
            scheduleShowFullScreen: false,
            scheduleShowPerLine: this.rawdata.ScheduleShowPerLine
          };
        }
      },
      GenerateClassificationsScreen : function(currentIndex)
      {
        if(!this.rawdata.Classifications)
        {return;}

        var typeOfScreen = "classification";

        var phases = this.GetCategoryScreenToShowBasedOnIndex(currentIndex);


        categoryObj = this.rawdata.Classifications[phases.category];
        phaseObj = categoryObj.Phases[phases.phase];
        groupObj = phaseObj.Groups[phases.group]
      

         

        if(phaseObj.Phase == "Fase Grupos")
        {
          return  {
            type: typeOfScreen +"-groupphase",
            category: categoryObj.Category,
            groupName: groupObj.Group ,
            groupStandings: groupObj.Standings,
            groupResults: groupObj.Results,
          };
        }
        else if(phaseObj.Phase == "Nonstop")
        {
          return  {
            type: typeOfScreen +"-nonstop",
            category: categoryObj.Category,
            groupName: "Nonstop",
            groupStandings: groupObj.Standings,
            groupResults: groupObj.Results,
          };
        }
        else if(phaseObj.Phase == "1/32")
        {
          return  {
            type: typeOfScreen +"-round64",
            category: categoryObj.Category,
            results: groupObj.Results,
          };
        }
        else if(phaseObj.Phase == "1/16")
        {
          return  {
            type: typeOfScreen +"-round32",
            category: categoryObj.Category,
            results: groupObj.Results,
          };
        }
        else if(phaseObj.Phase == "1/8")
        {
          return  {
            type: typeOfScreen +"-round16",
            category: categoryObj.Category,
            results: groupObj.Results,
          };
        }
        else if(phaseObj.Phase == "1/4" || phaseObj.Phase == "1/2" || phaseObj.Phase == "Final")
        {

          let quarterGames = categoryObj.Phases.filter(x => {return x.Phase == '1/4';});
          let semiGames = categoryObj.Phases.filter(x => {return x.Phase == '1/2';});
          let final = categoryObj.Phases.filter(x => {return x.Phase == 'Final';});


          return  {
            type: typeOfScreen +"-finals",
            category: categoryObj.Category,
            quarterResults: this.ReturnGamesForFinalsPhase(quarterGames),
            semiResults: this.ReturnGamesForFinalsPhase(semiGames),
            finalResults: this.ReturnGamesForFinalsPhase(final)
          };
        }
       
       



      },
      ReturnGamesForFinalsPhase(phase)
      { 
        try {
          return phase[0].Groups[0].Results
        } catch (error) {
          console.error(error);
          return null;

        }
      },


      RunLogic: function()
      {
          this.GetNow(); 
          this.GetDataFromAPI();
          this.WaitForNextScreen();
 
      },

      WaitForNextScreen() {
        // return;
        if (this.intervalId) {
          clearInterval(this.intervalId); // Clear the previous interval
        }

        this.intervalId = setInterval(this.RunLogic, 7500); // 10 seconds
       
      },

      GetCategoryScreens(category)
      {
        let toReturn = 0;
        if(category)
        {
          (category.Phases).forEach(phase => {
        
            toReturn += phase.Groups.length;
          })

        }

        return toReturn;

      },

      GetCategoryScreenToShowBasedOnIndex(mainIndex)
      {
        let categoryIndex = 0;
        let phaseIndex = 0;
        let groupIndex = 0;

        let index = 0;

        while(mainIndex > 0 )
        {

          let thisCategoryScreens = this.GetCategoryScreens(this.rawdata.Classifications[index]);

          if(thisCategoryScreens > mainIndex)
          {
            phaseIndex = 0;        
            //find phase
            while(mainIndex > 0 )
            {            
              if(this.rawdata.Classifications[index].Phases[phaseIndex].Groups.length >= mainIndex)
              {
                groupIndex = mainIndex-1;
                break;
              }
              else
              {
                mainIndex -= this.rawdata.Classifications[index].Phases[phaseIndex].Groups.length;
                phaseIndex++;

              }

            };
            break;
          }
          else
          {
            mainIndex -= thisCategoryScreens;
            index++;
          }
          categoryIndex = index;  
      
        }

        return {
          category: categoryIndex,
          phase: phaseIndex,
          group: groupIndex
        };

      },


  },
  computed: {

  },

  }).mount('#app')

