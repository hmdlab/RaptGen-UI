from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import random
from pydantic import BaseModel
from typing import List

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    # "*", # for testing
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    df = pd.read_csv("./local/sampledata.csv")
    return {"message": "Hello World?"}

@app.get("/dev/sample/selex")
async def sampledata():
    df = pd.read_csv("./local/sampledata_reduced.csv")
    return df.to_dict(orient="list")

@app.get("/dev/sample/seq")
async def sampleseq():
    return {
        "seq": ["AUG", "GAC", "CCG", "ATT"],
    }

@app.get("/dev/sample/VAEmodels")
async def sampleVAE():
    return {
        "entries": [
            "VAEmodel1",
            "VAEmodel2",
            "VAEmodel3",
        ]
    }

class VAEname(BaseModel):
    VAE_name: str

@app.get("/dev/sample/GMMmodels")
async def sampleGMM(VAE_name: str = ""):
    return {
        "entries": [
            f"GMMmodel1_{VAE_name}",
            f"GMMmodel2_{VAE_name}",
            f"GMMmodel3_{VAE_name}",
        ],
    }

@app.get("/dev/sample/measuredData")
async def sample_measured():
    return {
        "entries": [
            "measured data 1",
            "measured data 2",
            "measured data 3",
        ]
    }
    

@app.get("/dev/sample/measured")
async def measured_sample():
    df = pd.read_csv("./local/report_all.csv")
    result = list()
    for hue, subset_df in df.groupby("hue"):
        subset_df = subset_df[['ID', 'Sequence']]
        result.append({
            "hue": hue,
            "data": subset_df.to_dict(orient="list")
        })
    return result

class SeqContainer(BaseModel):
    seq: List[str]
    session_ID: int

class Sequence(BaseModel):
    seq: str

model_dict = dict()
model_dict.update({42: "test"})

import numpy as np

@app.post("/dev/sample/encode")
async def encode_sample(seq_container: SeqContainer):
    seqs = seq_container.seq
    global model_dict
    model = model_dict[seq_container.session_ID]

    # result = model(seqs)
    result = {
        "coord_x": np.random.normal(0, 1, len(seqs)).tolist(),
        "coord_y": np.random.normal(0, 1, len(seqs)).tolist(),
    }

    return result
    
@app.post("/dev/apitest/post")
async def post_test(seq: Sequence):
    print(f"Received: {seq.seq}")
    return {
        # "res": "ok",
        "message": f"Received {seq.seq}",
    }