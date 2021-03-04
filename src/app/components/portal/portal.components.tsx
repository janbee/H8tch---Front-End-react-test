import React, { forwardRef, memo, useCallback, useRef, useState } from 'react';
import './portal.component.scss';
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ColumnComponent, Ref as ColRef } from "@components/column/column.components";

interface Props {
}

interface State {
	loading: boolean;
	activeCol: string;
	addItem: string;
	filterItem: string;

}

export interface Ref {
}

const initialState = (props: Props) => {
	return {
		loading: false,
		activeCol: '',
		addItem: '',
		filterItem: '',
	};
};

export const PortalComponent = memo(
	forwardRef<Ref, Props>((props, ref) => {
		const [state, setState] = useState<State>(initialState(props));
		const Col1 = useRef<ColRef>(null);
		const Col2 = useRef<ColRef>(null);


		const inputChange = useCallback((name) => {
			return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
				const value = e.target.value;

				setState(prevState => ({
					...prevState,
					[name]: value,
				}));


				if(name === 'filterItem') {
					Col1.current?.filterItem.next(value);
					Col2.current?.filterItem.next(value);
				}
			};
		}, []);


		const handleAddItem = useCallback(() => {

			if(!state.addItem || !state.activeCol) return;


			if(state.activeCol === 'Col1') {
				Col1.current?.addItem.next(state.addItem);

			} else if(state.activeCol === 'Col2') {
				Col2.current?.addItem.next(state.addItem);
			}

			setState(prevState => ({...prevState, addItem: ''}));


		}, [state]);

		return (

			<div className="portal-wrap">

				<div className="container">

					<div className="header">
						Marvelous!
					</div>
					<div className="sub-header">
						Lorem Ipsum is simply dummy text of the printing <br/>
						and typesetting industry. Lorem Ipsum has been <br/>
						the industry's standard dummy text ever since.
					</div>

					<div className="ttl">
						<span>Add an Item</span>
					</div>

					<div className="content">
						<div>
							<div className="input-wrap">
								<input
									onChange={inputChange('addItem')}
									value={state.addItem}
									placeholder={'ENTER ITEM'}/>

								<select
									className="select-column"
									value={state.activeCol}
									onChange={inputChange('activeCol')}
									name="column">
									<option value="">CHOOSE COLUMN</option>
									<option value="Col1">Column 1</option>
									<option value="Col2">Column 2</option>
								</select>
							</div>
							<div className="input-wrap">
								<button onClick={handleAddItem} className={'btn'}>ADD ITEM</button>

								<div className="search-wrap">
									<span>SEARCH AN ITEM</span>
									<div>
										<input
											onChange={inputChange('filterItem')}
											value={state.filterItem}
											placeholder={'SEARCH'}/>
										<FontAwesomeIcon
											icon={faSearch}
											color={'#FFF'}/>
									</div>
								</div>
							</div>
						</div>
						<div>
							<ColumnComponent
								ref={Col1}
								name={'COLUMN 1'}/>
						</div>
						<div>
							<ColumnComponent
								ref={Col2}
								name={'COLUMN 2'}/>
						</div>
					</div>

				</div>


			</div>
		);
	}),
);


