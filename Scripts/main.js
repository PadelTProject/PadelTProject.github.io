



  
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
        const domain = 'https://www.padelteams.site';
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

          return axios({ url: 'https://padelteams.site/api/v1/tournament-info?code=' + this.tournamentCode, method: 'get' })
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
              this.PrepareGamesData();  
            })
            .catch(error => {
              console.log('An error occurred while fetching data.');
            });
        }
        else
        {
          this.PrepareTournamentData();
          this.PrepareGamesData();  
        }
        
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
        if(this.rawdata.Schedule)
          return Math.ceil(this.rawdata.Schedule.length / (this.rawdata.ScheduleShowPerLine * 2));
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
        if(this.rawdata.Schedule.length <= this.rawdata.ScheduleShowPerLine)
        {
          return  {
            type: typeOfScreen,
            scheduleData: this.rawdata.Schedule,
            scheduleShowFullScreen: true,
            scheduleShowPerLine: this.rawdata.ScheduleShowPerLine
          };

        }
        else
        {
          return {
            type: typeOfScreen,
            scheduleData: this.rawdata.Schedule,
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
        else if(phaseObj.Phase == "1/32")
        {
          return  {
            type: typeOfScreen +"-round64",
            category: categoryObj.Category,
            groupName: groupObj.Group ,
            groupStandings: groupObj.Standings,
            groupResults: groupObj.Results,
          };
        }
        else if(phaseObj.Phase == "1/16")
        {
          return  {
            type: typeOfScreen +"-round32",
            category: categoryObj.Category,
            groupName: groupObj.Group ,
            groupStandings: groupObj.Standings,
            groupResults: groupObj.Results,
          };
        }
        else if(phaseObj.Phase == "1/8")
        {
          return  {
            type: typeOfScreen +"-round16",
            category: categoryObj.Category,
            groupName: groupObj.Group ,
            groupStandings: groupObj.Standings,
            groupResults: groupObj.Results,
          };
        }
        else if(phaseObj.Phase == "1/4")
        {
          return  {
            type: typeOfScreen +"-quarter",
            category: categoryObj.Category,
            groupName: groupObj.Group ,
            groupStandings: groupObj.Standings,
            groupResults: groupObj.Results,
          };
        }
        else if(phaseObj.Phase == "1/2")
        {
          return  {
            type: typeOfScreen +"-semi",
            category: categoryObj.Category,
            groupName: groupObj.Group ,
            groupStandings: groupObj.Standings,
            groupResults: groupObj.Results,
          };
        }
        else if(phaseObj.Phase == "Final")
        {
          return  {
            type: typeOfScreen +"-final",
            category: categoryObj.Category,
            groupName: groupObj.Group ,
            groupStandings: groupObj.Standings,
            groupResults: groupObj.Results,
          };
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

        this.intervalId = setInterval(this.RunLogic, 10000); // 10 seconds
       
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
        while(mainIndex > 0 )
        {
          let index = 0;

          let thisCategoryScreens = this.GetCategoryScreens(this.rawdata.Classifications[index]);

          if(thisCategoryScreens > mainIndex)
          {
            categoryIndex = index;  
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

