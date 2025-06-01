// utils/parsePGN.ts
import keccak from 'keccak';
interface ParsedGame {
    id: string;
    event: string;
    site: string;
    white: string;
    black: string;
    result: string;
    utcDate: string;
    utcTime: string;
    whiteElo: number;
    blackElo: number;
    whiteRatingDiff: string;
    blackRatingDiff: string;
    eco: string;
    opening: string;
    timeControl: string;
    termination: string;
    moves: string;
}

export function parsePGNtoGames(pgnText: string): ParsedGame[] {
    const games: ParsedGame[] = [];

    const gameSections = pgnText.split(/\n(?=\[Event )/);

    for (const section of gameSections) {
        const tags = {} as Record<string, string>;
        const lines = section.trim().split('\n');

        let moveText = '';
        for (const line of lines) {
            if (line.startsWith('[')) {
                const match = line.match(/\[(\w+)\s+"(.*)"\]/);
                if (match) {
                    tags[ match[ 1 ] ] = match[ 2 ];
                }
            } else if (line.trim()) {
                moveText += line.trim() + ' ';
            }
        }
        const raw = {

            event: tags[ 'Event' ],
            site: tags[ 'Site' ],
            white: tags[ 'White' ],
            black: tags[ 'Black' ],
            result: tags[ 'Result' ],
            utcDate: tags[ 'UTCDate' ],
            utcTime: tags[ 'UTCTime' ],
            whiteElo: parseInt(tags[ 'WhiteElo' ]),
            blackElo: parseInt(tags[ 'BlackElo' ]),
            whiteRatingDiff: tags[ 'WhiteRatingDiff' ],
            blackRatingDiff: tags[ 'BlackRatingDiff' ],
            eco: tags[ 'ECO' ],
            opening: tags[ 'Opening' ],
            timeControl: tags[ 'TimeControl' ],
            termination: tags[ 'Termination' ],
            moves: moveText.trim(),
        }
        games.push(
            {
                id: keccak('keccak256').update(JSON.stringify(raw)).digest('hex'),
                ...raw
            }
        );
    }

    return games;
}
