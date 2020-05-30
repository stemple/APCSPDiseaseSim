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

    move() {
      this.xpos = this.xpos + this.xstep;
      this.ypos = this.ypos + this.ystep;
      this.elem.css("top", this.ypos);
      this.elem.css("left", this.xpos);
    }
  } 
  
  $(document).ready(() => {
    
    let $container = $("#container");
    let $total = $("#total");
    let $immune = $("#immune");

    // Some paraemters for the simulation
    let infectionDuration = 60;
    let numPeople = 300;
    
    // Counter for tracking the people who have healed
    let numHealed = 0;

    // Create the population of people
    let people = [];
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
        Math.random() * 4 - 2,
        Math.random() * 4 - 2, 
        $elem));
    }
    
    // infect one person - patient zero
    people[0].xpos = 45;
    people[0].ypos = 45;
    people[0].xstep = 2;
    people[0].ystep = 1;
    people[0].infected = true;
    people[0].infectious = infectionDuration;
    people[0].elem.addClass("infected");
    
    let id = setInterval(step, 50);
    
    // The main program loop - animate all the people moving
    function step() {
     
      for(let i = 0; i < numPeople; i++) {
        var p = people[i];
       
        // decrement infectious timer
        if(p.infectious > 0) {
          p.infectious = p.infectious - 1;
        }
        
        // Have they developed antibodies?
        if(p.infected == true && p.antibodies == false && p.infectious <= 0) {
          numHealed = numHealed + 1;
          p.antibodies = true;
          p.infected = false;
          p.xstep = Math.random() * 5 - 2.5;
          p.ystep = Math.random() * 5 - 2.5;
          p.elem.addClass("antibodies");
          p.elem.removeClass("infected");
        }

        // Check if person should "bounce" off container wall
        if (p.xpos > 790 || p.xpos < 0) {
          p.xstep = -p.xstep;
        }
        if (p.ypos > 390 || p.ypos < 0) {
          p.ystep = -p.ystep;
        }
        
        // Check for infection, but only for not infected people
        if(p.antibodies != true) {
          if(p.infected != true) {
            checkForInfection(p);
          }
        }

        // Move the person.
        p.move();
        
      }

      // Set the labels for tracking the sim numbers
      $total.text(`Total: ${numPeople}`);
      $immune.text(`Healed: ${numHealed}`);

    }

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
            p.infected = true;
            // timer for how long a person is infectious
            p.infectious = infectionDuration;
            p.elem.addClass("infected");
          }
       
         }
       }
    }
    
  });
  
  
  
  
  
  
  