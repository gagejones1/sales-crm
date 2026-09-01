from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

import models 
from database import engine

from routers import customers, companies, contacts, opportunities

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "https://sales-crm-r2tz.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(customers.router)
app.include_router(companies.router)
app.include_router(contacts.router)
app.include_router(opportunities.router)

models.Base.metadata.create_all(bind=engine)

@app.get("/")
def home(): 
    return {"message": "Sales CRM API is running!!"}


