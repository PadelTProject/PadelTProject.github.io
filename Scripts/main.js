



  
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
        // const domain = 'https://www.padelteams.pt';
        const domain = '.';
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
          (this.rawdata.Classifications.Phases).forEach(element => {
            
            total += element.Groups.length;
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
        if(!this.rawdata.Classifications.Phases)
        {return;}

        var typeOfScreen = "classification";

        while(currentIndex > 0 )
        {
          let index = 0;
          if (this.rawdata.Classifications.Phases[index].Groups.length > currentIndex)
          {
            categoryObj = this.rawdata.Classifications.Category;
            phaseObj = this.rawdata.Classifications.Phases[index];
            groupObj = this.rawdata.Classifications.Phases[index].Groups[currentIndex-1]
            currentIndex = 0;
          }
          else
          {
            currentIndex -= this.rawdata.Classifications.Phases[index].Groups.length;
            index ++;
          }
        }

        if(phaseObj.Phase == "Fase Grupos")
        {
          return  {
            type: typeOfScreen +"-groupphase",
            category: categoryObj,
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


  },
  computed: {

  },

  }).mount('#app')

