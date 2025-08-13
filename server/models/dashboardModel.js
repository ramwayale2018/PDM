import db from './../database/db.js';

export const totalClients = async () => {
    try {
        const query = 'SELECT COUNT(*) AS total_entries FROM vendors';
        const result = await db.query(query);
        return result;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
};

// Define `totalParts` and `totalProducts` similarly if needed


//fetch total Products
export const totalProducts= async ()=>{
    try{
        const query = 'SELECT COUNT(*) AS total_entries FROM products';
        const result = await db.query(query)
        return result;
    }
    catch(error){
        console.error('Error executing query:', error);
        throw error;
    }
}


//fetch total Parts
export const totalParts= async ()=>{
    try{
        const query = 'SELECT COUNT(*) AS total_entries FROM part_types';
        const result = await db.query(query)
        return result;
    }
    catch(error){
        console.error('Error executing query:', error);
        throw error;
    }
}

//fetch total completedParts
export const completedParts= async ()=>{
    try{
        const query = `SELECT COUNT(*) AS total_entries FROM products WHERE status='completed'`;
        const result = await db.query(query)
        return result;
    }
    catch(error){
        console.error('Error executing query:', error);
        throw error;
    }
}

//fetch total PartsInProgress
export const PartsInProgress= async ()=>{
    try{
        const query = `SELECT COUNT(*) AS total_entries FROM products WHERE status='in_progress'`;
        const result = await db.query(query)
        return result;
    }
    catch(error){
        console.error('Error executing query:', error);
        throw error;
    }
}

//fetch total PartsUnderReview
export const PartsUnderReview= async ()=>{
    try{
        const query = `SELECT COUNT(*) AS total_entries FROM products WHERE status='under_review'`;
        const result = await db.query(query)
        return result;
    }
    catch(error){
        console.error('Error executing query:', error);
        throw error;
    }
}

//fetch total PartsOnHold
export const PartsOnHold= async ()=>{
    try{
        const query = `SELECT COUNT(*) AS total_entries FROM products WHERE status='on_hold'`;
        const result = await db.query(query)
        return result;
    }
    catch(error){
        console.error('Error executing query:', error);
        throw error;
    }
}

//fetch total PendingParts
export const PendingParts= async ()=>{
    try{
        const query = `SELECT COUNT(*) AS total_entries FROM products WHERE status='pending'`;
        const result = await db.query(query)
        return result;
    }   
    catch(error){
        console.error('Error executing query:', error);
        throw error;
    }
}


// fetch active products 
export const ActiveProducts= async ()=>{
    try{
        const query = `SELECT COUNT(*) AS total_entries FROM products WHERE status='pending'`;
        const result = await db.query(query)
        return result;
    }
    catch(error){
        console.error('Error executing query:', error);
        throw error;
    }
}




