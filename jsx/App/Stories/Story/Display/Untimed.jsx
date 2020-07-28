import id from 'shortid';
import { Sentence } from "./Sentence.jsx";

export function UntimedTextDisplay({ sentences }) {
	// I/P: sentences, a list of sentences
	// O/P: the main gloss view, with several Sentences arranged vertically, each wrapped in an UntimedBlock
	// Status: tested, working
	let output = [];
	for (const sentence of sentences) {
		output.push(
			<div key={id.generate()} className="untimedBlock">
				<Sentence key={id.generate()} sentence={sentence} />
			</div>
		);
	}
	return <div id="untimedTextDisplay">{output}</div>;
}