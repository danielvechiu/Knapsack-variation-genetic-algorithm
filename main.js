$(document).ready(function()    {

    let budget = 5;
    let parameters  = 5;
    let items = 5;
    let generation = 0;
    let population = [];
    let noOfParameters = 1;
    const POPULATION_SIZE = 500;
    
    function create_chromosome(){ // chromosome creation
        let chromosome = []
        for(let i=0;i<noOfParameters;i++)
            chromosome.push(Math.floor(Math.random()*2)); 
        let individual = new Individual(chromosome, user.budget)   
        return individual;
    }

    function selection_and_mating(){
        let len = population.length;
        let randomParentIndex = Math.floor(Math.random()*51);
        let parent1 = population[randomParentIndex];
        randomParentIndex = Math.floor(Math.random()*51);
        let parent2 = population[randomParentIndex];
        let offspring = parent1.mate(parent2);
        return offspring;
    }

    //when this function returns true, the population converges therefore it no longer produces significantly better offspring compared to the previous generations
    function _90percent_of_population_that_has_the_same_fitness(){ 
        let populationLocal = population.sort((a, b) => b.fitness - a.fitness) //descending sorting by fitness
        let maxNoOfElemntsWithTheSameFitness = 0;

        for(let i=0;i<POPULATION_SIZE;i++){
            let x = populationLocal[i]; //x is the i-th chromosome
            let localNo = 1; //local variable holding the number of chromosomes with the same fitness - start from one because we're already on the first element 
            
            for(let j=i+1;j<POPULATION_SIZE && i!=POPULATION_SIZE-1;j++)
                if(populationLocal[j].fitness == x.fitness)
                    ++localNo;              
                else{
                    maxNoOfElemntsWithTheSameFitness = (localNo >maxNoOfElemntsWithTheSameFitness) ? localNo : maxNoOfElemntsWithTheSameFitness ;
                    i = j;
                }
        }
        return (maxNoOfElemntsWithTheSameFitness/POPULATION_SIZE >= 0.9) ? true : false;
    }
    
    // ------------------------------------------------------------------------------------------------------

    // Genetic Algorithm
    function genetic_algorithm(){
        //initial population
        for(let i=0;i<POPULATION_SIZE;i++){
           population.push(create_chromosome())
        }

        let finished = false;
        while(!finished){
            if(_90percent_of_population_that_has_the_same_fitness() == true){
                finished = true;
                population = population.sort((a,b)=> b.fitness-a.fitness); // descending sorting, the best individual being population[0] -> the chromosome with the highest fitness
                console.log("Best result achieved in generation: " + generation + ". The best individual has a fitness of: " + population[0].fitness);
                
                let x = population[0];
                let finalItems = []
                
                for(let i=0;i<x.length;i++)
                    if(x[i] == 1) 
                        finalItems.push(user.items[i]);         
                
                break;
            }
            
            let newPopulation = [];
            
            // we perform elitism to not lose the best individuals - we copy the best 10% of the population into the new population
            for(let i=0;i<population.length*10/100;i++)
                newPopulation.push(population[i]);
            
            //we populate the reminaing 90% of the population (free space) - we perform selection and mating between the fittest 50%
            //thus, the remainder 50% least fit individuals get replaced automatically
            for(let i=0;i<population.length*90/100;i++) 
                newPopulation.push(selection_and_mating());
            
            population = newPopulation; // the initial population is replaced by the better population, eliminating the 50% least fit individuals 
            generation++;
    }   
}
    //html manipulation 
    //#region
    
    $('.addParameterHTMLForm').click(function(e) {
        e.preventDefault();
        $(".needsContainer").append('<div style="margin-bottom: 2px;"><input style="margin-right:2px;" size="40" class="parameterName" type="text" placeholder="Happiness/Health/etc."><input style="margin-right:2px;" size="40" class="parameterValue" type="text" placeholder="How much does it matter to you from 0 to 10"><a href="#" class="delete">DEL</a></div>');
        noOfParameters++;
        $(".itemsContainer").empty();
        
    });
    
    //handles the removal of inputs for the need
    $(".needsContainer").on("click", ".delete", function(e) {
        e.preventDefault();
        noOfParameters--;
        $(this).parent('div').remove();
        $(".itemsContainer").empty();
    });
    // user.parameters = user.parameters.filter(function(parameter){
    //     return parameter.name !== name
    // })
    
    $('.addItemHTMLForm').click(function(e) {
        e.preventDefault();
        let textToAppend = '<div style="margin-bottom: 2px;"><input style="margin-right:-2px" size="40" class="itemName" type="text" placeholder="Item name"><input style="margin-right:2px;" size="40" class="itemPrice" type="text" placeholder="Item price"><a href="#" class="delete">DEL</a>'
        for(let i=0;i<noOfParameters;i++)
            textToAppend += '<input style="margin-right:2px;margin-bottom:2px;" size="60" class="itemPrice" type="text" placeholder="How much does this item contribute to your need number ' + (i+1) + ' from 0-10">';
        
            textToAppend += '</div>';
        $(".itemsContainer").append(textToAppend);
        // var newItem = new Item(name, price, arrOfValues);
        // user.items.push(newItem);
    });
    
    
    //handles the removal of inputs for the items
    $(".itemsContainer").on("click", ".delete", function(e) {
        e.preventDefault();
        $(this).parent('div').remove();
    });

    $('.startButton').click(function() {
        // gathering data from UI and transferring it to the globally instantiated user object
        let budget = document.getElementById('userBudget');
        
        let parameters = [];
        let parametersNames = document.getElementsByClassName('parameterName');
        let parametersValues = document.getElementsByClassName('parameterValue');
        
        for(let i=0;i<parameters.length;i++){
            var p = new Parameter(parametersNames[i], parametersValues[i]);
            parameters.push(p);
        }
        
        let items = []
        let itemsNames = document.getElementsByClassName('itemName');
        let itemPrices = document.getElementsByClassName('itemPrice');
        let itemValues = document.getElementsByClassName('itemValue');
        let len = itemsNames.length;
        let n=0; //counter of items
        let i=0; //counter of item values

        while(len-n){
            ++n;
            let valuesForItem = [];
            for(;i<itemValues.length;i++)
                valuesForItem.push(itemValues[i]);
            
            let newItem = new Item(itemsNames[n], itemPrices[n], valuesForItem);
            items.push(newItem);
        }

        user.budget = budget;
        user.parameters = parameters;
        user.items = items;

        genetic_algorithm();
    });
    //#endregion
});