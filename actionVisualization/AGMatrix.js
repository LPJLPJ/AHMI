/**
 * created by Zzen1sS
 **/

export class Vector{
    constructor([v1,v2,v3]=[0,0,0]){
        this.v1 = v1
        this.v2 = v2
        this.v3 = v3
    }

    mulVector(secondVector){
        return Number(this.v1 * secondVector.v1 + this.v2 * secondVector.v2 + this.v3 * secondVector.v3)
    }
}

export class Matrix {
    constructor([m00,m01,m02,m10,m11,m12,m20,m21,m22]=[1,0,0,0,1,0,0,0,1]){
        this.m00 = m00
        this.m01 = m01
        this.m02 = m02
        this.m10 = m10
        this.m11 = m11
        this.m12 = m12
        this.m20 = m20
        this.m21 = m21
        this.m22 = m22
    }

    mulMatrix(secondMatrix){
        return new Matrix([
            (new Vector([this.m00,this.m01,this.m02])).mulVector(new Vector([secondMatrix.m00,secondMatrix.m10,secondMatrix.m20])),(new Vector([this.m00,this.m01,this.m02])).mulVector(new Vector([secondMatrix.m01,secondMatrix.m11,secondMatrix.m21])),(new Vector([this.m00,this.m01,this.m02])).mulVector(new Vector([secondMatrix.m02,secondMatrix.m12,secondMatrix.m22])),
            (new Vector([this.m10,this.m11,this.m12])).mulVector(new Vector([secondMatrix.m00,secondMatrix.m10,secondMatrix.m20])),(new Vector([this.m10,this.m11,this.m12])).mulVector(new Vector([secondMatrix.m01,secondMatrix.m11,secondMatrix.m21])),(new Vector([this.m10,this.m11,this.m12])).mulVector(new Vector([secondMatrix.m02,secondMatrix.m12,secondMatrix.m22])),
            (new Vector([this.m20,this.m21,this.m22])).mulVector(new Vector([secondMatrix.m00,secondMatrix.m10,secondMatrix.m20])),(new Vector([this.m20,this.m21,this.m22])).mulVector(new Vector([secondMatrix.m01,secondMatrix.m11,secondMatrix.m21])),(new Vector([this.m20,this.m21,this.m22])).mulVector(new Vector([secondMatrix.m02,secondMatrix.m12,secondMatrix.m22]))
        ])
    }
}

