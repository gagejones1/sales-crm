from fastapi import FastAPI, Depends, HTTPException

import models 
import schemas
from database import engine, SessionLocal

from sqlalchemy.orm import Session 

from routers import customers, companies, contacts, opportunities

app = FastAPI()

app.include_router(customers.router)
app.include_router(companies.router)
app.include_router(contacts.router)
app.include_router(opportunities.router)

models.Base.metadata.create_all(bind=engine)

@app.get("/")
def home(): 
    return {"message": "Sales CRM API is running!!"}


