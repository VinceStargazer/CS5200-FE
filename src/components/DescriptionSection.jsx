const labelStyles = ' text-xs w-fit bg-slate-100 px-2 py-1 rounded-full';
const tdStyles = 'text-sm border border-dashed border-slate-300 px-2 py-1';
const formatColumns = ['Column Name', 'Type', 'Description'];

export default function DescriptionSection({ problem }) {
  const {
    problem_id,
    title,
    description,
    difficulty_level,
    topic,
    acceptance,
    tables,
    input_data = {},
    expected_output = [],
  } = problem;
  const inputTables = Object.entries(input_data);

  return (
    <>
      <h1 className="text-2xl font-semibold">{problem_id + '. ' + title}</h1>
      <div className="flex gap-3">
        <label
          title="difficulty level"
          className={
            (difficulty_level === 'Easy'
              ? 'text-green-500'
              : difficulty_level === 'Medium'
              ? 'text-yellow-500'
              : 'text-red-500') + labelStyles
          }
        >
          {difficulty_level}
        </label>
        <label title="topic" className={'text-slate-800' + labelStyles}>
          {topic}
        </label>
        <label title="acceptance rate" className={'text-slate-800' + labelStyles}>
          {acceptance + '%'}
        </label>
      </div>
      <p>{description}</p>
      {tables?.map(({ table_name, columns }) => (
        <TableSection
          key={table_name}
          tableName={'Table: ' + table_name}
          header={formatColumns}
          rows={columns?.map(({ name, type, description = '' }) => [
            name,
            type,
            description,
          ])}
        />
      ))}
      {inputTables?.map(([table_name, value]) => (
        <TableSection
          key={table_name}
          tableName={'Example input: ' + table_name}
          header={value[0]}
          rows={value.slice(1)}
        />
      ))}
      <TableSection
        tableName="Example output"
        header={expected_output[0]}
        rows={expected_output.slice(1)}
      />
    </>
  );
}

const TableSection = ({ tableName, header = [], rows = [] }) => {
  return (
    <div className="flex flex-col gap-2" key={tableName}>
      <span className="font-semibold">{tableName}</span>
      <table className="text-left">
        <thead>
          <tr>
            {header.map((item) => (
              <th key={item} className={tdStyles}>
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((item, i2) => (
                <td key={i2} className={tdStyles}>
                  {typeof item === 'string' ? item : JSON.stringify(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
