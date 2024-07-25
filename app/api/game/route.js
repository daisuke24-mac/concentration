// app/api/game/route.js

import { NextResponse } from 'next/server';
import { getGame } from '../../game';

export async function GET() {
    const game = getGame();
    return NextResponse.json(game.getGameState());
}

export async function POST(request) {
    const game = getGame();
    const { action, cardId } = await request.json();

    switch (action) {
        case 'start':
            game.startGame();
            return NextResponse.json(game.getGameState());

        case 'flip':
            const result = game.flipCard(cardId);
            return NextResponse.json({ ...result, ...game.getGameState() });

        case 'flipBack':
            game.flipBackCards();
            return NextResponse.json(game.getGameState());
            
        default:
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
}