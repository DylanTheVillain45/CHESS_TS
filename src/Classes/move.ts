import { Piece } from "./piece";
import { Type } from "../enums/pieceEnum";

export class Move {
  piece: Piece;
  startY: number;
  startX: number;
  endY: number;
  endX: number;

  capturedPiece?: Piece;
  promotionType?: Type;

  isCapture: boolean;
  isCastle: boolean;
  isShortCastle: boolean;
  isEnpassant: boolean;
  isPromotion: boolean;

  isCheck: boolean = false;
  isCheckMate: boolean = false;
  isStaleMate: boolean = false;

  constructor(
    piece: Piece,
    startY: number,
    startX: number,
    endY: number,
    endX: number,
    opts?: {
      capturedPiece?: Piece;
      isCastle?: boolean;
      isShortCastle?: boolean;
      isEnpassant?: boolean;
      isPromotion?: boolean;
      promotionType?: Type;
    }
  ) {
    this.piece = piece;
    this.startY = startY;
    this.startX = startX;
    this.endY = endY;
    this.endX = endX;

    this.capturedPiece = opts?.capturedPiece;
    this.isCapture = opts?.capturedPiece != undefined;
    this.isCastle = opts?.isCastle ?? false;
    this.isShortCastle = opts?.isShortCastle ?? false;
    this.isEnpassant = opts?.isEnpassant ?? false;
    this.isPromotion = opts?.isPromotion ?? false;
    this.promotionType = opts?.promotionType;
  }
}
