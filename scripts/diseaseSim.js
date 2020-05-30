class Person {
    constructor(_id, _xpos, _ypos, _xstep, _ystep, _elem) {
      this.id = _id;
      this.radius = 5;
      this.xpos = _xpos;
      this.ypos = _ypos;
      this.xstep = _xstep;
      this.ystep = _ystep;
      this.infectious = 0;
      this.infected = false;
      this.antibodies = false;
      this.sick = false;
      this.elem = _elem;
    }
  } 
  
  $(document).ready(() => {
    
    let $container = $("#container")
    
    let people = [];
    let numPeople = 300;
    let numInfected = 0;
    let numHealed = 0;

    // Create the population of people
    for(let i = 0; i < numPeople; i++) {
      var div = document.createElement("div");
      div.id = i;
      $container.append(div);
      let $elem = $("#" + i);
      $elem.addClass("dot");
      people.push(new Person(
        i,
        Math.random() * 790, 
        Math.random() * 390,
        Math.random() * 5 - 2.5,
        Math.random() * 5 - 2.5, 
        $elem));
    }
    
    // infect one person - patient zero
    people[0].xpos = 45;
    people[0].ypos = 45;
    people[0].xstep = 2;
    people[0].ystep = 1;
    people[0].infected = true;
    people[0].infectious = 100;
    people[0].elem.addClass("infected");

    numInfected = 1;
    
    let id = setInterval(frame, 50);
    
    // Collision algorithm to check if a person has become infected
    function checkForInfection(p) {
      for(let i = 0; i < numPeople; i++) {
        // basic circle-circle collision algorithm
        // skip if this is the same person or if not infectious
        if(p.id != people[i].id && people[i].infected == true) {
          let dx = p.xpos - people[i].xpos;
          let dy = p.ypos - people[i].ypos;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < p.radius + people[i].radius) {
            // collision detected! Infection ocurrs
            // console.log(p.id, "Infected!")
            // 50% chance of infection
            let chance =  Math.round(Math.random());
            if(chance == 1) {
              numInfected = numInfected + 1;
              p.infected = true;
              // timer for how long a person is infectious
              p.infectious = 200;
              p.elem.addClass("infected");
            
              // 50% people become sick and immobile
              // 50% are nonsymptomatic carriers
              p.sick = Math.round(Math.random());
              if(p.sick == 1) {
                p.xstep = 0;
                p.ystep = 0;
              }
            }
          }
       
         }
       }
    }
    
    // The main program loop - animate all the people moving
    function frame() {
     
      for(let i = 0; i < numPeople; i++) {
        var p = people[i];
       
        // decrement infectious timer
        if(p.infectious > 0) {
          p.infectious = p.infectious - 1;
        }
        
        // Have they developed antibodies?
        if(p.infected == true && p.antibodies == false && p.infectious <= 0) {
          //console.log(p.id, "Healed!")
          numInfected = numInfected - 1;
          numHealed = numHealed + 1;
          p.antibodies = true;
          p.infected = false;
          p.sick = false;
          p.xstep = Math.random() * 5 - 2.5;
          p.ystep = Math.random() * 5 - 2.5;
          p.elem.addClass("antibodies");
          p.elem.removeClass("infected");
        }

        // Move the person
        if (p.xpos > 790 || p.xpos < 0) {
          p.xstep = -p.xstep;
        }
        if (p.ypos > 390 || p.ypos < 0) {
          p.ystep = -p.ystep;
        }
  
        p.xpos = p.xpos + p.xstep;
        p.ypos = p.ypos + p.ystep;

        // update position on screen
        p.elem.css("top", p.ypos);
        p.elem.css("left", p.xpos);
        
        // Check for infection
        if(p.antibodies != true) {
          if(p.infected != true) {
            checkForInfection(p);
          }
        }
        
      }

      console.log("Infected", numInfected);
      console.log("Not Infected", numPeople - numInfected);
      console.log("Healed", numHealed);

    }
    
  });
  
  
  
  
  
  
  