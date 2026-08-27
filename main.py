from fastapi import FastAPI 

app = FastAPI()

@app.get("/")
def home(): 
    return {"message" : "Sales CRM API is running!!"}


customers =[
    {"id": 1, "name": "Apple"},
    {"id": 2, "name": "Microsoft"}
]
    
@app.get("/customers")
def get_customers():
    return customers

@app.post("/customers")
def create_customer(customer: dict):
    customers.append(customer)
    return customer

@app.get("/customers/{customer_id}")
def get_customer(customer_id: int):
    for customer in customers:
        if customer["id"] == customer_id:
            return customer

@app.patch("/customers/{customer_id}")
def update_customer(customer_id: int, updated_customer: dict):
    for customer in customers:
        if customer["id"] == customer_id:
            customer.update(updated_customer)
            return customer

@app.delete("/customers/{customer_id}")
def delete_customer(customer_id: int):
    for customer in customers:
        if customer["id"] == customer_id:
            customers.remove(customer)
            return {"message": "Customer Deleted"}