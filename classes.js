class Parameter {
    constructor(name, value) {
        this.name = name; //e.g. happiness
        this.value = value;//how important it is to the user from 0-10
    }
}

class Item{
    constructor(name, price, values){
        this.name = name;
        this.price = price;
        this.values = values;
    }

    getPrice(){
        return this.price;
    }

    getValue(){ //return the weighted average in relation with parameter's values
        let s1, s2=0;
        
        for(let i=0;i<parameters.length;i++){
            s1 += parameters[i].value * this.values[i];
            s2 += this.values[i];
        }
        
        return s1/s2;
    }
}

class Individual{ //one individual is a representation of the presence of the items in our repertoire. [0, 1] - item0 not present, item1 present
    constructor(chromosome){
        if(chromosome.length != items.length)
            console.log("Chromosome length is not the same as the items'")    
        this.chromosome = chromosome;
        this.fitness = calculateFitness();
    }

    calculateFitness(){ //calculate fitness of one individual
        let fitness = 0;
        let totalPriceOfGenes = 0; //genes are items, so they have a price, we use the price to see how many items can we get in total
        
        for(let i=0;i<this.chromosome.length;i++){    
            if(chromosome[i] == 1){
                fitness += items[i].getValue();
                totalPriceOfGenes += items[i].getPrice();
                    if(totalPriceOfGenes > doc)
                    return 0;
            }
        }
        return fitness;
    }

    mate(individual2){
        child_chromosome = [];
        for(let i=0;i<this.chromosome.length;i++){
            let r = Math.random();
            if(r<0.45)
                child_chromosome.push(this.chromosome[i]);
            else    
            if(r>0.45 && r<0.9)
                child_chromosome.push(individual2.chromosome[i]);
            else
                child_chromosome.push(Math.floor(Math.random()*2)) //add a mutated gene (random from the pool of genes, for us it's only 0 and 1) 
        }
    }
}